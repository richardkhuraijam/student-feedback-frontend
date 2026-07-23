import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import CourseForm from '../../components/CourseForm';
import EmptyState from '../../components/EmptyState';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { showToast } = useToast();

  const loadCourses = async () => {
    const data = await api.getCourses();
    setCourses(data.courses || []);
  };

  useEffect(() => {
    loadCourses()
      .catch((err) => showToast(err.message || 'Failed to load courses', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSave = async (formData) => {
    try {
      if (editingCourse) {
        await api.updateCourse(editingCourse.id, formData);
        showToast('Course updated successfully');
      } else {
        await api.createCourse(formData);
        showToast('Course added successfully');
      }
      await loadCourses();
      setShowForm(false);
      setEditingCourse(null);
    } catch (err) {
      showToast(err.message || 'Failed to save course', 'error');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.deleteCourse(courseId);
      await loadCourses();
      showToast('Course deleted', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete course', 'error');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="page manage-courses">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page manage-courses">
      <div className="page-header page-header-row">
        <div>
          <h1>Manage Courses</h1>
          <p>Add, edit, or remove courses</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Course
          </button>
        )}
      </div>

      {showForm && (
        <div className="card form-card">
          <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
          <CourseForm course={editingCourse} onSave={handleSave} onCancel={handleCancel} />
        </div>
      )}

      {courses.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses yet"
          description="Add your first course to get started."
        />
      ) : (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td><span className="badge">{course.code}</span></td>
                    <td>{course.name}</td>
                    <td>{course.instructor}</td>
                    <td>{course.semester}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(course)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
