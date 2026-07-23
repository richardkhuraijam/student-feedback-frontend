import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">📋</span>
          <span className="brand-text">FeedbackHub</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/courses" className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="nav-icon">📚</span> Manage Courses
          </NavLink>
          <NavLink to="/admin/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="nav-icon">💬</span> View Feedback
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-avatar">{user?.name?.charAt(0)}</span>
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main-wrapper">
        <header className="admin-mobile-header">
          <div className="topnav-brand">
            <span className="brand-icon">📋</span>
            <span className="brand-text">FeedbackHub</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <nav className="admin-mobile-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/courses" className={({ isActive }) => (isActive ? 'active' : '')}>
            Courses
          </NavLink>
          <NavLink to="/admin/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
            Feedback
          </NavLink>
        </nav>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
