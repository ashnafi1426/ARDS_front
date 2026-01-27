import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PageLayout = ({ children, title = 'Page' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out bg-gradient-to-b from-[#115e59] to-[#042f2e] border-r border-white/5 shadow-3xl z-[100] ${isSidebarOpen ? 'w-[280px]' : 'w-24'}`}>
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/5 bg-black/20">
          {isSidebarOpen && (
            <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Student Hub <span className="text-teal-400">v2</span>
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
                  ? 'bg-white/10 text-white font-black shadow-2xl scale-[1.02] border border-white/10'
                  : 'text-teal-100/60 hover:bg-white/5 hover:text-white'
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
            className="w-full flex items-center gap-5 px-5 py-4 rounded-[20px] text-teal-100/60 hover:bg-red-500/20 hover:text-red-400 transition-all group"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">🚪</span>
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-[0.2em]">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[#1e1b4b]">
        {/* Header */}
        <header className="h-20 bg-slate-900/60 backdrop-blur-xl text-white flex items-center justify-between px-10 z-[90] relative shadow-2xl border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="relative">
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">{title}</h2>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-500 rounded-full shadow-[0_0_10px_#14b8a6]" />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-white font-black text-xs uppercase tracking-tight">{user?.firstName} {user?.lastName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                <span className="text-teal-400 text-[8px] font-black uppercase tracking-[0.2em]">Active Session</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-indigo-600 p-0.5 shadow-xl transition-transform hover:scale-110 cursor-pointer">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-black text-sm uppercase">
                {user?.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-0 bg-[#1e1b4b] -z-10" />
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
