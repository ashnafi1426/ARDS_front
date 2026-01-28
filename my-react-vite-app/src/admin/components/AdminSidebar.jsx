import { Link, useLocation } from 'react-router-dom';
import '../styles/admin-sidebar.css';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'User Management', path: '/admin/users', icon: '👥' },
    { label: 'Student Management', path: '/admin/students', icon: '🎓' },
    { label: 'Advisor Management', path: '/admin/advisors', icon: '👨‍🏫' },
    { label: 'Course Management', path: '/admin/courses', icon: '📚' },
    { label: 'Semester Management', path: '/admin/semesters', icon: '📅' },
    { label: 'Reports', path: '/admin/reports', icon: '📈' },
    { label: 'System Monitoring', path: '/admin/monitoring', icon: '🔍' },
    { label: 'Notifications', path: '/admin/notifications', icon: '🔔' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
    { label: 'Security', path: '/admin/security', icon: '🔒' },
    { label: 'Maintenance', path: '/admin/maintenance', icon: '🔧' },
    { label: 'Troubleshooting', path: '/admin/troubleshooting', icon: '🐛' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">ARDS Admin</h2>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
