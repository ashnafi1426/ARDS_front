import { useState, useEffect } from 'react';
import UserManagement from './UserManagement';
import StudentDataManagement from './StudentDataManagement';
import AdvisorManagement from './AdvisorManagement';
import RiskMonitoring from './RiskMonitoring';
import SystemOversight from './SystemOversight';
import ConfigurationManagement from './ConfigurationManagement';
import NotificationsManagement from './NotificationsManagement';
import SecurityCompliance from './SecurityCompliance';
import Maintenance from './Maintenance';

const AdminDashboardComplete = ({ activeTab }) => {
  const [stats, setStats] = useState({
    totalUsers: 24,
    totalStudents: 18,
    activeAdvisors: 3,
    atRiskStudents: 8,
    systemAlerts: 22,
    activeUsers: 22
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'students':
        return <StudentDataManagement />;
      case 'advisors':
        return <AdvisorManagement />;
      case 'risk':
        return <RiskMonitoring />;
      case 'system':
        return <SystemOversight />;
      case 'config':
        return <ConfigurationManagement />;
      case 'notifications':
        return <NotificationsManagement />;
      case 'security':
        return <SecurityCompliance />;
      case 'maintenance':
        return <Maintenance />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

const DashboardOverview = ({ stats }) => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold text-gray-900">Welcome, Admin!</h1>
      <p className="text-gray-600 mt-2">System Status: <span className="text-green-600 font-semibold">HEALTHY</span></p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="blue" />
      <StatCard icon="🎓" label="Total Students" value={stats.totalStudents} color="purple" />
      <StatCard icon="👨‍🏫" label="Active Advisors" value={stats.activeAdvisors} color="green" />
      <StatCard icon="⚠️" label="At-Risk Students" value={stats.atRiskStudents} color="orange" />
      <StatCard icon="🔔" label="System Alerts" value={stats.systemAlerts} color="red" />
      <StatCard icon="✓" label="Active Users" value={stats.activeUsers} color="teal" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <QuickActionsPanel />
      <SystemHealthPanel />
    </div>
  </div>
);

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'border-l-blue-500 bg-blue-50',
    purple: 'border-l-purple-500 bg-purple-50',
    green: 'border-l-green-500 bg-green-50',
    orange: 'border-l-orange-500 bg-orange-50',
    red: 'border-l-red-500 bg-red-50',
    teal: 'border-l-teal-500 bg-teal-50'
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
      </div>
    </div>
  );
};

const QuickActionsPanel = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-3">
      <ActionButton icon="➕" label="Add New User" />
      <ActionButton icon="📊" label="Generate Report" />
      <ActionButton icon="⚙️" label="System Settings" />
      <ActionButton icon="🔄" label="Refresh Data" />
    </div>
  </div>
);

const ActionButton = ({ icon, label }) => (
  <button className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-medium text-sm text-gray-900">
    <span className="text-lg">{icon}</span>
    {label}
  </button>
);

const SystemHealthPanel = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
    <div className="space-y-3">
      <HealthItem label="Server Status" status="Online" color="green" />
      <HealthItem label="Database" status="Connected" color="green" />
      <HealthItem label="API" status="Operational" color="green" />
      <HealthItem label="Email Service" status="Active" color="green" />
    </div>
  </div>
);

const HealthItem = ({ label, status, color }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
    <span className="text-gray-700 font-medium">{label}:</span>
    <span className={`flex items-center gap-2 font-semibold ${color === 'green' ? 'text-green-600' : 'text-orange-600'}`}>
      <span className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-600' : 'bg-orange-600'}`}></span>
      {status}
    </span>
  </div>
);

export default AdminDashboardComplete;
