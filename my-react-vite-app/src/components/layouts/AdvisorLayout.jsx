import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/AdvisorDashboard.css';

const AdvisorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync activeTab with location changes
  useEffect(() => {
    setActiveTab(getActiveTab(location.pathname));
  }, [location.pathname]);

  function getActiveTab(pathname) {
    if (pathname === '/advisor') return 'dashboard';
    if (pathname.includes('/students')) return 'students';
    if (pathname.includes('/reports')) return 'reports';
    if (pathname.includes('/interventions')) return 'interventions';
    if (pathname.includes('/notifications')) return 'notifications';
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/help')) return 'help';
    return 'dashboard';
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/advisor' },
    { id: 'students', label: 'Students', icon: '👥', path: '/advisor/students' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📊', path: '/advisor/reports' },
    { id: 'interventions', label: 'Interventions', icon: '📝', path: '/advisor/interventions' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/advisor/notifications' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/advisor/profile' },
    { id: 'help', label: 'Help', icon: '❓', path: '/advisor/help' }
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      setActiveTab(item.id);
      navigate(item.path);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">

      {/* Reverted Purple Sidebar - Consistent with Screenshot */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-[#6366f1] text-white shadow-xl z-50 ${isSidebarOpen ? 'w-[260px]' : 'w-20'}`}
      >
        {/* Portal Branding */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-[#4f46e5]">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
              Advisor Portal
            </h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg hover:bg-white/10 transition-all ${!isSidebarOpen ? 'mx-auto' : ''}`}
          >
            <svg className={`w-6 h-6 text-white transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-white/20 text-white font-bold shadow-md'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Portion */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-indigo-100 hover:bg-white/10 hover:text-white transition-all group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">🚪</span>
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area - Restored to Black/Dark Theme as requested */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[#1e1b4b]">

        {/* Standardized Portal Header - Matches Screenshot Dark Blue */}
        <header className="h-16 bg-[#1e293b] text-white flex items-center justify-between px-8 z-40 relative shadow-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">Academic Risk Detection</h2>
            <div className="h-4 w-px bg-white/20 mx-2" />
            <span className="text-slate-400 text-sm font-medium capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <p className="text-white font-bold text-sm tracking-tight">{user?.firstName} {user?.lastName}</p>
              <span className="bg-[#4f46e5] px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm border border-white/10">
                Advisor
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Primary Viewport - Seamless Dark Experience */}
        <main className="flex-1 overflow-y-auto text-slate-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdvisorLayout;
