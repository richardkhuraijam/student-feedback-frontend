import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import EmptyState from '../../components/EmptyState';
import { RatingDisplay } from '../../components/StarRating';

export default function MyFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getMyFeedback()
      .then((data) => setFeedbackList(data.feedback || []))
      .catch((err) => setError(err.message || 'Failed to load feedback'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page my-feedback">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page my-feedback">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!feedbackList.length) {
    return (
      <div className="page my-feedback">
        <div className="page-header">
          <h1>My Feedback</h1>
          <p>View all feedback you have submitted</p>
        </div>
        <EmptyState
          icon="📝"
          title="No feedback submitted yet"
          description="Go to your dashboard and submit feedback for your enrolled courses."
        />
      </div>
    );
  }

  const getOverallRating = (ratings) => {
    const values = Object.values(ratings);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="page my-feedback">
      <div className="page-header">
        <h1>My Feedback</h1>
        <p>View all feedback you have submitted</p>
      </div>

      <div className="feedback-history">
        {feedbackList.map((fb) => (
          <div key={fb.id} className="card feedback-history-card">
            <div className="feedback-history-header">
              <div>
                <span className="badge">{fb.course?.code}</span>
                <h3>{fb.course?.name}</h3>
                <p>{fb.course?.instructor}</p>
              </div>
              <div className="feedback-history-meta">
                <RatingDisplay value={parseFloat(getOverallRating(fb.ratings))} />
                <span className="feedback-date">
                  {new Date(fb.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            {fb.comments && (
              <p className="feedback-preview">
                {fb.comments.length > 120
                  ? `${fb.comments.slice(0, 120)}...`
                  : fb.comments}
              </p>
            )}
            <Link to={`/student/feedback/${fb.courseId}`} className="btn btn-ghost btn-sm">
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
