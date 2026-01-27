import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105">
              <span className="text-4xl group-hover:rotate-12 transition-transform duration-300 drop-shadow-lg">🎓</span>
              <h2 className="text-[30px] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 drop-shadow-md">
                Academic Risk Detection
              </h2>
            </Link>
            {user.role === 'student' && (
              <div className="hidden md:flex items-center">
                <div className="h-6 w-px bg-white/20 mx-4"></div>
                <span className="text-blue-100 font-medium bg-blue-800/30 px-3 py-1 rounded-full text-sm">Student Portal</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user.role === 'student' && (
              <>
                <Link
                  to="/student"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:text-blue-200 transition-all duration-300 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/self-check"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:text-blue-200 transition-all duration-300 font-medium"
                >
                  Self-Check
                </Link>
                <Link
                  to="/student/profile"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:text-blue-200 transition-all duration-300 font-medium"
                >
                  Profile
                </Link>
              </>
            )}

            {user.role === 'advisor' && (
              <Link
                to="/advisor"
                className="px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:text-blue-200 transition-all duration-300 font-medium"
              >
                Dashboard
              </Link>
            )}

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:text-blue-200 transition-all duration-300 font-medium"
              >
                Admin Panel
              </Link>
            )}

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-primary-600">
              <span className="text-sm">{user.firstName} {user.lastName}</span>
              <span className="bg-primary-600 px-3 py-1 rounded-full text-xs uppercase font-semibold">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-md transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
