import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiSearch, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

const AdvisorHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/advisor/dashboard') return 'Dashboard';
    if (path === '/advisor/students') return 'My Students';
    if (path.startsWith('/advisor/students/')) return 'Student Details';
    if (path === '/advisor/alerts') return 'Alerts & Notifications';
    if (path === '/advisor/reports') return 'Reports & Analytics';
    if (path === '/advisor/communication') return 'Communication';
    if (path === '/advisor/compliance') return 'Assessment Compliance';
    if (path === '/advisor/settings') return 'Settings';
    if (path === '/advisor/profile') return 'Profile';
    return 'Advisor Portal';
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  const mockNotifications = [
    { id: 1, message: 'John Doe has high risk score', time: '5 min ago', unread: true },
    { id: 2, message: 'Sarah Smith completed self-assessment', time: '1 hour ago', unread: true },
    { id: 3, message: 'Weekly report is ready', time: '2 hours ago', unread: false }
  ];

  return (
    <header className="advisor-header">
      <div className="header-left">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="header-search">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="search-input"
          />
        </div>

        {/* Notifications */}
        <div className="header-notifications">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />
            <span className="notification-badge">2</span>
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Mark all read</button>
              </div>
              <div className="notifications-list">
                {mockNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                ))}
              </div>
              <div className="notifications-footer">
                <button onClick={() => navigate('/advisor/alerts')}>
                  View all alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="header-user">
          <button 
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <FiUser />
            </div>
            <span className="user-name">Dr. Smith</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <button 
                className="dropdown-item"
                onClick={() => navigate('/advisor/profile')}
              >
                <FiUser /> Profile
              </button>
              <button 
                className="dropdown-item"
                onClick={() => navigate('/advisor/settings')}
              >
                <FiSettings /> Settings
              </button>
              <hr className="dropdown-divider" />
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdvisorHeader;