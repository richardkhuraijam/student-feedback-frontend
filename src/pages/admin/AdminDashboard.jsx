import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import FeedbackChart from '../../components/FeedbackChart';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page admin-dashboard">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page admin-dashboard">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'blue' },
    { label: 'Total Students', value: stats.totalStudents, icon: '👥', color: 'green' },
    { label: 'Feedback Submitted', value: stats.feedbackSubmitted, icon: '💬', color: 'purple' },
    { label: 'Average Rating', value: stats.averageRating || '—', icon: '⭐', color: 'orange' },
  ];

  return (
    <div className="page admin-dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of course feedback activity</p>
      </div>

      <div className="stats-grid">
        {cards.map((stat) => (
          <div key={stat.label} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <FeedbackChart chartData={stats.chart || []} />
      </div>
    </div>
  );
}
