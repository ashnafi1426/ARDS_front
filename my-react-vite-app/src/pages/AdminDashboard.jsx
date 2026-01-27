import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdminLayout from '../components/layouts/AdminLayout';
import '../styles/AdminDashboard.css';

// Admin Components
import UserManagementPanel from '../components/admin/UserManagementPanel';
import StudentManagement from '../components/admin/StudentManagement';
import AdvisorManagement from '../components/admin/AdvisorManagement';
import RiskMonitoring from '../components/admin/RiskMonitoring';
import SystemOversight from '../components/admin/SystemOversight';
import ConfigurationManagement from '../components/admin/ConfigurationManagement';
import NotificationsManagement from '../components/admin/NotificationsManagement';
import SecurityCompliance from '../components/admin/SecurityCompliance';
import Maintenance from '../components/admin/Maintenance';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdvisors: 0,
    totalAdmins: 0,
    activeUsers: 0,
    atRiskStudents: 0,
    systemHealth: 'healthy',
    systemAlerts: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const statsRes = await api.get('/stats/dashboard');
      if (statsRes.data.status === 'success' && statsRes.data.data) {
        setStats(statsRes.data.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data.');
      setLoading(false);
    }
  };

  const renderContent = () => {
    const setSuccess = (msg) => console.log('Success:', msg);
    const setError = (msg) => console.log('Error:', msg);

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'users':
        return <UserManagementPanel setSuccess={setSuccess} setError={setError} />;
      case 'students':
        return <StudentManagement setSuccess={setSuccess} setError={setError} />;
      case 'advisors':
        return <AdvisorManagement setSuccess={setSuccess} setError={setError} />;
      case 'risk':
        return <RiskMonitoring setSuccess={setSuccess} setError={setError} />;
      case 'system':
        return <SystemOversight setSuccess={setSuccess} setError={setError} />;
      case 'config':
        return <ConfigurationManagement setSuccess={setSuccess} setError={setError} />;
      case 'notifications':
        return <NotificationsManagement setSuccess={setSuccess} setError={setError} />;
      case 'security':
        return <SecurityCompliance setSuccess={setSuccess} setError={setError} />;
      case 'maintenance':
        return <Maintenance setSuccess={setSuccess} setError={setError} />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="admin-content">
        {error && <ErrorMessage message={error} />}
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats }) => {
  return (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <h1>Welcome, Admin!</h1>
        <p>System Status: <span className={`status ${stats.systemHealth}`}>{stats.systemHealth.toUpperCase()}</span></p>
      </div>

      {/* Key Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{stats.totalStudents.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <div className="stat-label">Active Advisors</div>
            <div className="stat-value">{stats.totalAdvisors}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-label">At-Risk Students</div>
            <div className="stat-value">{stats.atRiskStudents}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <div className="stat-label">System Alerts</div>
            <div className="stat-value">{stats.systemAlerts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{stats.activeUsers}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span className="action-text">Add New User</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span className="action-text">Generate Report</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🔧</span>
            <span className="action-text">System Settings</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🔄</span>
            <span className="action-text">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="system-health">
        <h2>System Health</h2>
        <div className="health-items">
          <div className="health-item">
            <span className="health-label">Server Status</span>
            <span className="health-status online">Online</span>
          </div>
          <div className="health-item">
            <span className="health-label">Database</span>
            <span className="health-status online">Connected</span>
          </div>
          <div className="health-item">
            <span className="health-label">API</span>
            <span className="health-status online">Operational</span>
          </div>
          <div className="health-item">
            <span className="health-label">Email Service</span>
            <span className="health-status online">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
