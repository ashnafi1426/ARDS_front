import { useState } from 'react';
import '../styles/admin-header.css';

const AdminHeader = ({ user, onLogout, onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          ☰
        </button>
        <div className="header-info">
          <h1>Admin Dashboard</h1>
          <p className="current-date">{getCurrentDate()}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="user-section">
          <button 
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="user-avatar">{user?.firstName?.[0] || 'A'}</span>
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <div className="menu-item">
                <span>👤 Profile</span>
              </div>
              <div className="menu-item">
                <span>⚙️ Settings</span>
              </div>
              <hr />
              <div className="menu-item logout" onClick={onLogout}>
                <span>🚪 Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
