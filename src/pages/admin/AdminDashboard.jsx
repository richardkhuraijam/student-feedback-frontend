import { getCourses, getFeedback } from '../../utils/storage';
import { getStudentCount, getAverageRating } from '../../utils/mockData';
import FeedbackChart from '../../components/FeedbackChart';

export default function AdminDashboard() {
  const courses = getCourses();
  const feedback = getFeedback();
  const studentCount = getStudentCount();
  const avgRating = getAverageRating(feedback);

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: '📚', color: 'blue' },
    { label: 'Total Students', value: studentCount, icon: '👥', color: 'green' },
    { label: 'Feedback Submitted', value: feedback.length, icon: '💬', color: 'purple' },
    { label: 'Average Rating', value: avgRating || '—', icon: '⭐', color: 'orange' },
  ];

  return (
    <div className="page admin-dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of course feedback activity</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
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
        <FeedbackChart />
      </div>
    </div>
  );
}
