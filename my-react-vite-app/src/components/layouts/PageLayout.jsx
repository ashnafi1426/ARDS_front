import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PageLayout = ({ children, title = 'Page' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Backup Completed', message: 'Your data backup was successful', time: '2 hours ago', type: 'success' },
    { id: 2, title: 'Weekly Report Available', message: 'Your weekly academic report is ready', time: '1 day ago', type: 'info' },
    { id: 3, title: 'High Risk Students Alert', message: 'You have been flagged as high risk', time: '3 days ago', type: 'warning' }
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/student/dashboard' },
    { id: 'self-check', label: 'Self-Check', icon: '📝', path: '/student/self-check' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/student/notifications' },
    { id: 'resources', label: 'Resources', icon: '📚', path: '/student/resources' },
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/student/calendar' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/student/profile' },
    { id: 'help', label: 'Help', icon: '❓', path: '/student/help' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => window.location.pathname === path;

  return (
    <div className="flex h-screen bg-white text-black overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out bg-gradient-to-b from-blue-600 to-blue-800 border-r border-gray-300 shadow-3xl z-[100] ${isSidebarOpen ? 'w-[280px]' : 'w-24'}`}>
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/5 bg-black/20">
          {isSidebarOpen && (
            <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Student Hub <span className="text-blue-300">v2</span>
            </h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-3 rounded-2xl hover:bg-white/10 transition-all ${!isSidebarOpen ? 'mx-auto' : ''}`}
          >
            <svg className={`w-6 h-6 text-white transition-transform duration-500 ${!isSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-5 px-5 py-4 rounded-[20px] transition-all duration-300 group outline-none focus:outline-none
                ${isActive(item.path)
                  ? 'bg-blue-100 text-blue-900 font-black shadow-2xl scale-[1.02] border border-blue-300'
                  : 'text-blue-100 hover:bg-blue-500/20 hover:text-white'
                }
              `}
            >
              <span className={`text-2xl transition-transform duration-500 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              {isSidebarOpen && (
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-5 px-5 py-4 rounded-[20px] text-blue-100 hover:bg-red-500/20 hover:text-red-400 transition-all group"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">🚪</span>
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-[0.2em]">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-white">
        {/* Header */}
        <header className="h-20 bg-white backdrop-blur-xl text-black flex items-center justify-between px-10 z-[90] relative shadow-md border-b border-gray-200">
          {/* Left: Navigation Links */}
          <nav className="flex items-center gap-8">
            <button onClick={() => navigate('/student/dashboard')} className="text-sm font-black text-gray-600 hover:text-blue-600 uppercase tracking-tight transition-colors">Dashboard</button>
            <button onClick={() => navigate('/student/self-check')} className="text-sm font-black text-gray-600 hover:text-blue-600 uppercase tracking-tight transition-colors">Self-Check</button>
            <button onClick={() => navigate('/student/calendar')} className="text-sm font-black text-gray-600 hover:text-blue-600 uppercase tracking-tight transition-colors">Calendar</button>
            <button onClick={() => navigate('/student/notifications')} className="text-sm font-black text-gray-600 hover:text-blue-600 uppercase tracking-tight transition-colors">Reports</button>
            <button onClick={() => navigate('/student/help')} className="text-sm font-black text-gray-600 hover:text-blue-600 uppercase tracking-tight transition-colors">Help</button>
          </nav>

          {/* Right: User Info & Actions */}
          <div className="flex items-center gap-6">
            {/* Notifications Bell with Dropdown */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{notifications.length}</span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-black text-black uppercase tracking-tight">Notifications</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <span className="text-lg mt-1">
                              {notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : 'ℹ️'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-sm text-black uppercase tracking-tight">{notif.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-[10px] text-gray-500 mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500 text-sm">No notifications</div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button onClick={() => navigate('/student/notifications')} className="w-full text-center text-blue-600 font-black text-xs uppercase tracking-tight hover:text-blue-700">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-300">
              <div className="flex flex-col items-end">
                <p className="text-black font-black text-xs uppercase tracking-tight">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-500 text-[10px] font-bold">Student</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg transition-transform hover:scale-110 cursor-pointer">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-sm uppercase text-blue-600">
                  {user?.firstName?.charAt(0)}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-md">
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-0 bg-white -z-10" />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
