import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../styles/admin-layout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="admin-main">
        <AdminHeader 
          user={user} 
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
