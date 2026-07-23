import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getCourses, getFeedback, setFeedback, generateId } from '../../utils/storage';
import { hasSubmittedFeedback, RATING_QUESTIONS } from '../../utils/mockData';
import { validateFeedback } from '../../utils/validation';
import StarRating, { RatingDisplay } from '../../components/StarRating';

const EMPTY_RATINGS = {
  contentQuality: 0,
  teachingEffectiveness: 0,
  paceDifficulty: 0,
  learningMaterials: 0,
  overallSatisfaction: 0,
};

export default function FeedbackForm() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const course = getCourses().find((c) => c.id === courseId);
  const existingFeedback = getFeedback().find(
    (f) => f.studentId === user.id && f.courseId === courseId
  );
  const alreadySubmitted = hasSubmittedFeedback(user.id, courseId);

  const [ratings, setRatings] = useState(
    existingFeedback?.ratings ?? { ...EMPTY_RATINGS }
  );
  const [comments, setComments] = useState(existingFeedback?.comments ?? '');
  const [errors, setErrors] = useState({});

  if (!course) {
    return (
      <div className="page feedback-form-page">
        <div className="card">
          <h2>Course not found</h2>
          <Link to="/student" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleRatingChange = (key, value) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (alreadySubmitted) return;

    const validationErrors = validateFeedback(ratings);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      showToast('Please complete all rating questions', 'error');
      return;
    }

    const newFeedback = {
      id: generateId(),
      studentId: user.id,
      courseId: course.id,
      ratings,
      comments: comments.trim(),
      submittedAt: new Date().toISOString(),
    };

    setFeedback([...getFeedback(), newFeedback]);
    showToast('Feedback submitted successfully!');
    navigate('/student');
  };

  if (alreadySubmitted) {
    return (
      <div className="page feedback-form-page">
        <div className="page-header">
          <Link to="/student" className="back-link">← Back to Dashboard</Link>
          <h1>Feedback for {course.name}</h1>
        </div>

        <div className="card submitted-card">
          <div className="submitted-banner">
            <span className="submitted-icon">✓</span>
            <div>
              <h2>Already Submitted</h2>
              <p>You submitted feedback for this course on{' '}
                {new Date(existingFeedback.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="readonly-form">
            <div className="form-group">
              <label>Course Name</label>
              <input type="text" value={course.name} readOnly />
            </div>
            <div className="form-group">
              <label>Instructor</label>
              <input type="text" value={course.instructor} readOnly />
            </div>

            <div className="ratings-section">
              <h3>Your Ratings</h3>
              {RATING_QUESTIONS.map((q) => (
                <div key={q.key} className="rating-question readonly">
                  <label>{q.label}</label>
                  <RatingDisplay value={existingFeedback.ratings[q.key]} />
                </div>
              ))}
            </div>

            {existingFeedback.comments && (
              <div className="form-group">
                <label>Additional Comments</label>
                <textarea value={existingFeedback.comments} readOnly rows={4} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page feedback-form-page">
      <div className="page-header">
        <Link to="/student" className="back-link">← Back to Dashboard</Link>
        <h1>Course Feedback</h1>
        <p>Share your experience for {course.name}</p>
      </div>

      <form className="card feedback-form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Course Name</label>
            <input type="text" value={course.name} readOnly className="readonly-input" />
          </div>
          <div className="form-group">
            <label>Instructor</label>
            <input type="text" value={course.instructor} readOnly className="readonly-input" />
          </div>
        </div>

        <div className="ratings-section">
          <h3>Rate Your Experience</h3>
          <p className="ratings-hint">Please rate each aspect from 1 (Poor) to 5 (Excellent)</p>
          {RATING_QUESTIONS.map((q) => (
            <div key={q.key} className="rating-question">
              <label>{q.label}</label>
              <StarRating
                value={ratings[q.key]}
                onChange={(val) => handleRatingChange(q.key, val)}
              />
              {errors[q.key] && <span className="error-text">{errors[q.key]}</span>}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="comments">Additional Comments / Suggestions</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any additional thoughts about the course..."
            rows={4}
          />
        </div>

        <div className="form-actions">
          <Link to="/student" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}
