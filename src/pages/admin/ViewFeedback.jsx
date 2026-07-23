import { useState } from 'react';
import { getCourses, getFeedback } from '../../utils/storage';
import { getFeedbackByCourse, getAverageRating, RATING_QUESTIONS } from '../../utils/mockData';
import EmptyState from '../../components/EmptyState';
import { RatingDisplay } from '../../components/StarRating';

export default function ViewFeedback() {
  const courses = getCourses();
  const allFeedback = getFeedback();
  const [filterCourse, setFilterCourse] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredCourses =
    filterCourse === 'all'
      ? courses.filter((c) => allFeedback.some((f) => f.courseId === c.id))
      : courses.filter((c) => c.id === filterCourse);

  const toggleExpand = (courseId) => {
    setExpandedId(expandedId === courseId ? null : courseId);
  };

  if (!allFeedback.length) {
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
        {filteredCourses.map((course) => {
          const courseFeedback = getFeedbackByCourse(course.id);
          if (!courseFeedback.length) return null;
          const avgRating = getAverageRating(courseFeedback);
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
                    {courseFeedback.length} response{courseFeedback.length !== 1 ? 's' : ''}
                  </span>
                  <RatingDisplay value={parseFloat(avgRating)} />
                  <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="feedback-responses">
                  {courseFeedback.map((fb) => (
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
