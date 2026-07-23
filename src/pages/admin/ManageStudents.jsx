import { useEffect, useMemo, useState } from 'react';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const loadData = async () => {
    const [studentsData, coursesData] = await Promise.all([
      api.getStudents(),
      api.getCourses(),
    ]);
    setStudents(studentsData.students || []);
    setCourses(coursesData.courses || []);
  };

  useEffect(() => {
    loadData()
      .catch((err) => showToast(err.message || 'Failed to load students', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  const availableCourses = useMemo(() => {
    if (!selectedStudent) return courses;
    const enrolledIds = new Set((selectedStudent.courses || []).map((c) => c.id));
    return courses.filter((c) => !enrolledIds.has(c.id));
  }, [courses, selectedStudent]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) {
      showToast('Select both a student and a course', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.enrollStudent({
        studentId: selectedStudentId,
        courseId: selectedCourseId,
      });
      showToast('Student enrolled successfully');
      setSelectedCourseId('');
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to enroll student', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnenroll = async (studentId, courseId, courseCode) => {
    if (!window.confirm(`Remove this student from ${courseCode}?`)) return;
    try {
      await api.unenrollStudent({ studentId, courseId });
      showToast('Student unenrolled', 'info');
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to unenroll student', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page manage-students">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page manage-students">
      <div className="page-header">
        <h1>Manage Students</h1>
        <p>View students and assign them to courses</p>
      </div>

      <div className="card form-card">
        <h2>Assign Course</h2>
        <form className="form course-form" onSubmit={handleEnroll}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId">Student</label>
              <select
                id="studentId"
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setSelectedCourseId('');
                }}
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="courseId">Course</label>
              <select
                id="courseId"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={!selectedStudentId}
              >
                <option value="">Select a course</option>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} — {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !selectedStudentId || !selectedCourseId}
            >
              {submitting ? 'Assigning...' : 'Assign Course'}
            </button>
          </div>
        </form>
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No students yet"
          description="Students will appear here after they sign up with the student role."
        />
      ) : (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Enrolled Courses</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      {student.courses?.length ? (
                        <div className="table-actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                          {student.courses.map((course) => (
                            <span key={course.id} className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                              {course.code}
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '0 0.25rem', minHeight: 0 }}
                                onClick={() =>
                                  handleUnenroll(student.id, course.id, course.code)
                                }
                                title={`Remove from ${course.code}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted, #888)' }}>No courses assigned</span>
                      )}
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
