import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/AdminDashboard.css';

const AdminLayout = ({ children, activeOverride, onTabChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [internalTab, setInternalTab] = useState(getActiveTab(location.pathname));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeTab = activeOverride || internalTab;
  const setActiveTab = (tab) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  // Only sync with location if we navigated to a DIFFERENT functional path
  useEffect(() => {
    const tab = getActiveTab(location.pathname);
    if (location.pathname !== '/admin') {
      setActiveTab(tab);
    }
  }, [location.pathname]);

  function getActiveTab(pathname) {
    if (pathname.includes('/users')) return 'users';
    if (pathname.includes('/students')) return 'students';
    if (pathname.includes('/advisors')) return 'advisors';
    if (pathname.includes('/risk')) return 'risk';
    if (pathname.includes('/reports')) return 'reports';
    if (pathname.includes('/system')) return 'system';
    if (pathname.includes('/config')) return 'config';
    if (pathname.includes('/notifications')) return 'notifications';
    if (pathname.includes('/security')) return 'security';
    if (pathname.includes('/maintenance')) return 'maintenance';
    return 'overview';
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'users', label: 'User Hub', icon: '👥' },
    { id: 'students', label: 'Student Registry', icon: '🎓' },
    { id: 'advisors', label: 'Advisor Cluster', icon: '👨‍🏫' },
    { id: 'risk', label: 'Risk Monitor', icon: '⚠️' },
    { id: 'reports', label: 'Analytical Reports', icon: '📈' },
    { id: 'system', label: 'System Oversight', icon: '🖥️' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security & Audit', icon: '🔒' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' }
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    if (item.path) {
      navigate(item.path);
    }
    // Dispatch custom event for sub-panels
    window.dispatchEvent(new CustomEvent('admin-tab-change', { detail: { tab: item.id } }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">

      {/* Reverted Blue Sidebar - Standard Admin Style */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-[#2563eb] text-white shadow-xl z-50 ${isSidebarOpen ? 'w-[260px]' : 'w-20'}`}
      >
        {/* Portal Branding */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-[#1d4ed8]">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
              Admin Panel
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
                w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
                ${activeTab === item.id
                  ? 'bg-white/95 text-blue-700 font-black shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-r-4 border-blue-400 translate-x-1 scale-[1.02]'
                  : 'text-blue-50 hover:bg-white/10 hover:text-white hover:translate-x-1'
                }
              `}
            >
              <span className={`text-xl transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              {isSidebarOpen && (
                <span className="text-[13px] font-bold uppercase tracking-wider">
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
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-blue-50 hover:bg-white/10 hover:text-white transition-all group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">🚪</span>
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area - Upgraded to High-Fidelity Black Theme */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[#1e1b4b]">

        {/* Standardized Portal Header - Matches Dark Blue Identity */}
        <header className="h-16 bg-[#1e293b] text-white flex items-center justify-between px-8 z-40 relative shadow-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">Academic Risk Detection</h2>
            <div className="h-4 w-px bg-white/20 mx-2" />
            <span className="text-slate-400 text-sm font-medium capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Primary Viewport - Seamless Command Center */}
        <main className="flex-1 overflow-y-auto text-slate-200 selection:bg-indigo-600/30">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
