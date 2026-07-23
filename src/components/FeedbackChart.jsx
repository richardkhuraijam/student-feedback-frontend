export default function FeedbackChart({ chartData = [] }) {
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const hasFeedback = chartData.some((d) => d.count > 0);

  if (!hasFeedback) {
    return (
      <div className="chart-empty">
        <p>No feedback data to display yet.</p>
      </div>
    );
  }

  return (
    <div className="feedback-chart">
      <h3>Feedback Distribution by Course</h3>
      <div className="bar-chart">
        {chartData.map((item) => (
          <div key={item.name} className="bar-chart-item">
            <div className="bar-label">
              <span className="bar-code">{item.name}</span>
              <span className="bar-meta">
                {item.count} response{item.count !== 1 ? 's' : ''}
                {item.avgRating > 0 && ` · Avg ${item.avgRating}`}
              </span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pie-chart-section">
        <h4>Average Rating by Course</h4>
        <div className="rating-bars">
          {chartData
            .filter((d) => d.avgRating > 0)
            .map((item) => (
              <div key={item.name} className="rating-bar-item">
                <span className="rating-bar-label">{item.name}</span>
                <div className="rating-bar-track">
                  <div
                    className="rating-bar-fill"
                    style={{ width: `${(item.avgRating / 5) * 100}%` }}
                  />
                </div>
                <span className="rating-bar-value">{item.avgRating}/5</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
