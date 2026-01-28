import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sidebar menu items - Updated to match actual routes
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/student/dashboard' },
    { id: 'profile', label: 'User Profile', icon: '👥', path: '/student/profile' },
    { id: 'self-check', label: 'Self-Check', icon: '🔐', path: '/student/self-check' },
    { id: 'resources', label: 'Resources', icon: '📚', path: '/student/resources' },
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/student/calendar' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/student/notifications' },
    { id: 'help', label: 'Help', icon: '❓', path: '/student/help' },
    { id: 'logout', label: 'Logout', icon: '🚪', path: '/logout' }
  ];

  const handleMenuClick = (item) => {
    if (item.id === 'logout') {
      logout();
      navigate('/login');
    } else {
      navigate(item.path);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Risk Assessment Submitted', message: 'Your risk status is LOW', time: '5pm', type: 'success' },
    { id: 2, title: 'Weekly Report Available', message: 'Your weekly report is ready', time: '2 hours ago', type: 'info' },
    { id: 3, title: 'High Risk Alert', message: 'Immediate support recommended', time: '6 hours ago', type: 'warning' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-700 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-4 flex items-center gap-3 border-b border-blue-600">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">
            O
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-sm">Early Academic</h1>
              <p className="text-xs opacity-80">Risk Detection</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-800 transition-colors ${
                isActive(item.path) ? 'bg-blue-800 border-l-4 border-white' : ''
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 hover:bg-blue-800 transition-colors border-t border-blue-600"
        >
          <span className="text-2xl">{sidebarOpen ? '◀' : '▶'}</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">{user?.role === 'admin' ? 'Admin User' : 'Student User'}</h2>
              <span className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-bold">
                {user?.role || 'Admin'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <span className="text-2xl">🔔</span>
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 text-gray-900">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-bold text-lg">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">
                              {notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : 'ℹ️'}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{notif.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-gray-200">
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          navigate('/student/notifications');
                        }}
                        className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</p>
                  <p className="text-xs opacity-80">{user?.email || 'admin@ards.com'}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold">
                  {(user?.firstName?.[0] || 'A').toUpperCase()}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
