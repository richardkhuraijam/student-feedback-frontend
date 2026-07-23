import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { RATING_QUESTIONS } from '../../utils/mockData';
import EmptyState from '../../components/EmptyState';
import { RatingDisplay } from '../../components/StarRating';

export default function ViewFeedback() {
  const [grouped, setGrouped] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filterCourse, setFilterCourse] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getFeedbackByCourse(), api.getCourses()])
      .then(([feedbackData, coursesData]) => {
        setGrouped(feedbackData.courses || []);
        setCourses(coursesData.courses || []);
      })
      .catch((err) => setError(err.message || 'Failed to load feedback'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page view-feedback">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page view-feedback">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const filtered =
    filterCourse === 'all'
      ? grouped
      : grouped.filter((g) => g.course.id === filterCourse);

  const toggleExpand = (courseId) => {
    setExpandedId(expandedId === courseId ? null : courseId);
  };

  if (!grouped.length) {
    return (
      <div className="page view-feedback">
        <div className="page-header">
          <h1>View Feedback</h1>
          <p>Review student feedback across all courses</p>
        </div>
        <EmptyState
          icon="💬"
          title="No feedback submitted yet"
          description="Feedback will appear here once students submit their responses."
        />
      </div>
    );
  }

  return (
    <div className="page view-feedback">
      <div className="page-header page-header-row">
        <div>
          <h1>View Feedback</h1>
          <p>Review student feedback across all courses</p>
        </div>
        <select
          className="filter-select"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="feedback-list">
        {filtered.map(({ course, count, averageRating, feedback }) => {
          const isExpanded = expandedId === course.id;

          return (
            <div key={course.id} className="card feedback-course-card">
              <button
                className="feedback-course-header"
                onClick={() => toggleExpand(course.id)}
              >
                <div className="feedback-course-info">
                  <span className="badge">{course.code}</span>
                  <div>
                    <h3>{course.name}</h3>
                    <p>{course.instructor} · {course.semester}</p>
                  </div>
                </div>
                <div className="feedback-course-stats">
                  <span className="feedback-count">
                    {count} response{count !== 1 ? 's' : ''}
                  </span>
                  <RatingDisplay value={parseFloat(averageRating)} />
                  <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="feedback-responses">
                  {feedback.map((fb) => (
                    <div key={fb.id} className="feedback-response">
                      <div className="response-header">
                        <span className="response-student">{fb.student?.name ?? 'Unknown'}</span>
                        <span className="response-date">
                          {new Date(fb.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="response-ratings">
                        {RATING_QUESTIONS.map((q) => (
                          <div key={q.key} className="response-rating-row">
                            <span className="rating-label">{q.label}</span>
                            <RatingDisplay value={fb.ratings[q.key]} />
                          </div>
                        ))}
                      </div>
                      {fb.comments && (
                        <div className="response-comments">
                          <strong>Comments:</strong>
                          <p>{fb.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
