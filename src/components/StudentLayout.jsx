import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout student-layout">
      <header className="topnav">
        <div className="topnav-brand">
          <span className="brand-icon">📋</span>
          <span className="brand-text">FeedbackHub</span>
        </div>
        <nav className="topnav-links">
          <NavLink to="/student" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/student/my-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
            My Feedback
          </NavLink>
        </nav>
        <div className="topnav-actions">
          <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main-content student-main">{children}</main>
    </div>
  );
}
