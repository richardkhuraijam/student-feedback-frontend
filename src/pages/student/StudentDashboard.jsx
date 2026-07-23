import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import EmptyState from '../../components/EmptyState';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getEnrolledCourses()
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err.message || 'Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page student-dashboard">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page student-dashboard">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="page student-dashboard">
        <div className="page-header">
          <h1>My Courses</h1>
          <p>View your enrolled courses and submit feedback</p>
        </div>
        <EmptyState
          icon="📚"
          title="No courses enrolled yet"
          description="You are not enrolled in any courses yet. Ask an admin to assign courses to your account."
        />
      </div>
    );
  }

  return (
    <div className="page student-dashboard">
      <div className="page-header">
        <h1>My Courses</h1>
        <p>View your enrolled courses and submit feedback</p>
      </div>

      <div className="course-cards-grid">
        {courses.map((course) => {
          const submitted = course.submitted;
          return (
            <div key={course.id} className="card course-card">
              <div className="course-card-header">
                <span className="badge">{course.code}</span>
                <span className={`status-badge ${submitted ? 'submitted' : 'pending'}`}>
                  {submitted ? 'Submitted' : 'Pending'}
                </span>
              </div>
              <h3>{course.name}</h3>
              <p className="course-instructor">{course.instructor}</p>
              <p className="course-semester">{course.semester}</p>
              <div className="course-card-actions">
                {submitted ? (
                  <Link to={`/student/feedback/${course.id}`} className="btn btn-secondary btn-sm">
                    View Submission
                  </Link>
                ) : (
                  <Link to={`/student/feedback/${course.id}`} className="btn btn-primary btn-sm">
                    Give Feedback
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
