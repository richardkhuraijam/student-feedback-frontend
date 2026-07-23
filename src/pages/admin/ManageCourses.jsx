import { useState } from 'react';
import { getCourses, setCourses, getEnrollments, setEnrollments, getFeedback, setFeedback, generateId } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import CourseForm from '../../components/CourseForm';
import EmptyState from '../../components/EmptyState';

export default function ManageCourses() {
  const [courses, setCoursesState] = useState(getCourses());
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { showToast } = useToast();

  const refresh = () => setCoursesState(getCourses());

  const handleSave = (formData) => {
    if (editingCourse) {
      const updated = courses.map((c) =>
        c.id === editingCourse.id ? { ...c, ...formData } : c
      );
      setCourses(updated);
      showToast('Course updated successfully');
    } else {
      const newCourse = { id: generateId(), ...formData };
      setCourses([...courses, newCourse]);
      showToast('Course added successfully');
    }
    refresh();
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setCourses(courses.filter((c) => c.id !== courseId));
    setEnrollments(getEnrollments().filter((e) => e.courseId !== courseId));
    setFeedback(getFeedback().filter((f) => f.courseId !== courseId));
    refresh();
    showToast('Course deleted', 'info');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

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
