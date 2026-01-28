import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import SystemOverview from '../components/SystemOverview';
import RecentAlerts from '../components/RecentAlerts';
import '../styles/admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 1250,
    atRiskStudents: 145,
    activeAdvisors: 28,
    systemAlerts: 5,
  });

  const [riskThresholds, setRiskThresholds] = useState({
    gpa: 2.5,
    attendance: 75,
    assignment: 60,
  });

  const [systemStatus, setSystemStatus] = useState({
    server: 'Online',
    database: 'Connected',
    api: 'Operational',
  });

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, message: 'Student John Doe at critical risk', type: 'critical', time: '5 mins ago' },
    { id: 2, message: 'System backup completed successfully', type: 'success', time: '1 hour ago' },
    { id: 3, message: 'API response time increased', type: 'warning', time: '2 hours ago' },
  ]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Admin Dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div onClick={() => handleCardClick('/admin/students')} style={{ cursor: 'pointer' }}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="🎓"
            color="blue"
          />
        </div>
        <div onClick={() => handleCardClick('/admin/reports')} style={{ cursor: 'pointer' }}>
          <StatCard
            title="At-Risk Students"
            value={stats.atRiskStudents}
            icon="⚠️"
            color="red"
          />
        </div>
        <div onClick={() => handleCardClick('/admin/advisors')} style={{ cursor: 'pointer' }}>
          <StatCard
            title="Active Advisors"
            value={stats.activeAdvisors}
            icon="👨‍🏫"
            color="green"
          />
        </div>
        <div onClick={() => handleCardClick('/admin/notifications')} style={{ cursor: 'pointer' }}>
          <StatCard
            title="System Alerts"
            value={stats.systemAlerts}
            icon="🔔"
            color="orange"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* System Overview */}
        <div className="grid-item">
          <SystemOverview status={systemStatus} />
        </div>

        {/* Risk Thresholds */}
        <div className="grid-item">
          <div className="card">
            <h2>Risk Thresholds</h2>
            <div className="threshold-item">
              <label>GPA Threshold</label>
              <input
                type="range"
                min="0"
                max="4"
                step="0.1"
                value={riskThresholds.gpa}
                onChange={(e) =>
                  setRiskThresholds({ ...riskThresholds, gpa: e.target.value })
                }
              />
              <span>{riskThresholds.gpa}</span>
            </div>
            <div className="threshold-item">
              <label>Attendance Threshold (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={riskThresholds.attendance}
                onChange={(e) =>
                  setRiskThresholds({ ...riskThresholds, attendance: e.target.value })
                }
              />
              <span>{riskThresholds.attendance}%</span>
            </div>
            <div className="threshold-item">
              <label>Assignment Completion (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={riskThresholds.assignment}
                onChange={(e) =>
                  setRiskThresholds({ ...riskThresholds, assignment: e.target.value })
                }
              />
              <span>{riskThresholds.assignment}%</span>
            </div>
            <button className="btn btn-primary">Save Thresholds</button>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="grid-item full-width">
          <RecentAlerts alerts={recentAlerts} />
        </div>

        {/* At-Risk Students Chart */}
        <div className="grid-item">
          <div className="card">
            <h2>At-Risk Students Distribution</h2>
            <div className="chart-placeholder">
              <p>📊 Chart will be displayed here</p>
              <p style={{ fontSize: '12px', color: '#999' }}>
                (Integrate with chart library like Chart.js or Recharts)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
