import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiAlertTriangle, 
  FiBarChart3, 
  FiMessageSquare, 
  FiCheckSquare, 
  FiSettings, 
  FiUser,
  FiMenu,
  FiX
} from 'react-icons/fi';

const AdvisorSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/advisor/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/advisor/students', icon: FiUsers, label: 'My Students' },
    { path: '/advisor/alerts', icon: FiAlertTriangle, label: 'Alerts' },
    { path: '/advisor/reports', icon: FiBarChart3, label: 'Reports' },
    { path: '/advisor/communication', icon: FiMessageSquare, label: 'Messages' },
    { path: '/advisor/compliance', icon: FiCheckSquare, label: 'Compliance' },
    { path: '/advisor/settings', icon: FiSettings, label: 'Settings' },
    { path: '/advisor/profile', icon: FiUser, label: 'Profile' }
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-30 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : ''}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-gray-900">ARDS Advisor</span>
        </div>
        <button 
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FiMenu className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === '/advisor/students' && location.pathname.startsWith('/advisor/students/'));
            
            return (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Dr. Smith</p>
              <p className="text-xs text-gray-500 truncate">Academic Advisor</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdvisorSidebar;