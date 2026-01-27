import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const StudentProfileLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/student');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-20 bg-slate-900/60 backdrop-blur-xl text-white flex items-center justify-between px-10 z-[90] relative shadow-2xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <button
            onClick={handleBack}
            className="p-3 rounded-2xl hover:bg-white/10 transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="relative">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Identity Registry</h2>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-500 rounded-full shadow-[0_0_10px_#14b8a6]" />
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">profile node</span>
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
          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl hover:bg-red-500/20 transition-all"
            title="Logout"
          >
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#1e1b4b]">
        <div className="absolute inset-0 bg-[#1e1b4b] -z-10" />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentProfileLayout;
