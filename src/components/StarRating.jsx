export default function StarRating({ value, onChange, readOnly = false, size = 'md' }) {
  return (
    <div className={`star-rating star-rating-${size} ${readOnly ? 'read-only' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= value ? 'filled' : ''}`}
          onClick={() => !readOnly && onChange?.(star)}
          disabled={readOnly}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function RatingDisplay({ value }) {
  return (
    <span className="rating-display">
      <StarRating value={Math.round(value)} readOnly size="sm" />
      <span className="rating-value">{value}</span>
    </span>
  );
}
