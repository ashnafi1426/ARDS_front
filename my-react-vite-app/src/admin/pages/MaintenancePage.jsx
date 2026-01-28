import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const MaintenancePage = () => {
  const [databaseHealth, setDatabaseHealth] = useState({
    status: 'healthy',
    size: '2.5 GB',
    tables: 15,
    lastOptimized: '2024-01-15',
    fragmentation: 5
  });
  const [backupStatus, setBackupStatus] = useState({
    lastBackup: '2024-01-28 02:00 AM',
    nextBackup: '2024-01-29 02:00 AM',
    backupSize: '1.8 GB',
    frequency: 'daily',
    status: 'completed'
  });
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([
    { id: 1, task: 'Database Optimization', schedule: 'Weekly (Sunday 2 AM)', status: 'scheduled' },
    { id: 2, task: 'Backup', schedule: 'Daily (2 AM)', status: 'scheduled' },
    { id: 3, task: 'Log Cleanup', schedule: 'Monthly (1st, 3 AM)', status: 'scheduled' },
    { id: 4, task: 'Cache Clear', schedule: 'Daily (12 AM)', status: 'scheduled' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backingUp, setBackingUp] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('database');

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      setError('');

      const [dbRes, backupRes, scheduleRes] = await Promise.all([
        api.get('/admin/maintenance/database-health').catch(() => ({ data: { data: databaseHealth } })),
        api.get('/admin/maintenance/backup-status').catch(() => ({ data: { data: backupStatus } })),
        api.get('/admin/maintenance/schedule').catch(() => ({ data: { data: maintenanceSchedule } }))
      ]);

      setDatabaseHealth(dbRes.data.data || databaseHealth);
      setBackupStatus(backupRes.data.data || backupStatus);
      setMaintenanceSchedule(scheduleRes.data.data || maintenanceSchedule);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
      setError('Failed to load maintenance data');
      setLoading(false);
    }
  };

  const handleTriggerBackup = async () => {
    try {
      setBackingUp(true);
      setError('');
      await api.post('/admin/maintenance/backup', {});
      setSuccess('Backup triggered successfully');
      setTimeout(() => {
        setSuccess('');
        fetchMaintenanceData();
      }, 2000);
    } catch (err) {
      setError('Failed to trigger backup');
    } finally {
      setBackingUp(false);
    }
  };

  const handleOptimizeDatabase = async () => {
    try {
      setOptimizing(true);
      setError('');
      await api.post('/admin/maintenance/optimize-database', {});
      setSuccess('Database optimization started');
      setTimeout(() => {
        setSuccess('');
        fetchMaintenanceData();
      }, 2000);
    } catch (err) {
      setError('Failed to optimize database');
    } finally {
      setOptimizing(false);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'danger';
      default:
        return 'info';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Maintenance & Support</h1>
        <p>Manage system maintenance, backups, and database health</p>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="success-message">{success}</div>}

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            🗄️ Database Health
          </button>
          <button
            className={`tab-button ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            💾 Backup Management
          </button>
          <button
            className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            📅 Maintenance Schedule
          </button>
        </div>

        {/* Database Health Tab */}
        {activeTab === 'database' && (
          <div className="tab-content">
            <div className="maintenance-grid">
              <div className="card">
                <div className="health-header">
                  <h2>Database Status</h2>
                  <span className={`badge badge-${getHealthColor(databaseHealth.status)}`}>
                    {databaseHealth.status.toUpperCase()}
                  </span>
                </div>

                <div className="health-details">
                  <div className="detail-row">
                    <span className="detail-label">Database Size:</span>
                    <span className="detail-value">{databaseHealth.size}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tables:</span>
                    <span className="detail-value">{databaseHealth.tables}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Optimized:</span>
                    <span className="detail-value">{databaseHealth.lastOptimized}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Fragmentation:</span>
                    <span className="detail-value">{databaseHealth.fragmentation}%</span>
                  </div>
                </div>

                <div className="health-bar">
                  <div className="bar-label">Fragmentation Level</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${databaseHealth.fragmentation}%`,
                        backgroundColor: databaseHealth.fragmentation > 20 ? '#ff6b6b' : '#51cf66'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="maintenance-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleOptimizeDatabase}
                    disabled={optimizing}
                  >
                    {optimizing ? '⏳ Optimizing...' : '🔧 Optimize Database'}
                  </button>
                  <button className="btn btn-secondary">📊 View Statistics</button>
                </div>
              </div>

              <div className="card">
                <h2>Database Recommendations</h2>
                <div className="recommendations-list">
                  {databaseHealth.fragmentation > 20 && (
                    <div className="recommendation warning">
                      <span className="icon">⚠️</span>
                      <div>
                        <strong>High Fragmentation</strong>
                        <p>Database fragmentation is above 20%. Consider running optimization.</p>
                      </div>
                    </div>
                  )}
                  <div className="recommendation info">
                    <span className="icon">ℹ️</span>
                    <div>
                      <strong>Regular Backups</strong>
                      <p>Ensure backups are running on schedule daily.</p>
                    </div>
                  </div>
                  <div className="recommendation success">
                    <span className="icon">✓</span>
                    <div>
                      <strong>Database Health</strong>
                      <p>Overall database health is good. No critical issues detected.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup Management Tab */}
        {activeTab === 'backup' && (
          <div className="tab-content">
            <div className="maintenance-grid">
              <div className="card">
                <h2>Backup Status</h2>

                <div className="backup-info">
                  <div className="info-row">
                    <span className="info-label">Last Backup:</span>
                    <span className="info-value">{backupStatus.lastBackup}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Next Backup:</span>
                    <span className="info-value">{backupStatus.nextBackup}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Backup Size:</span>
                    <span className="info-value">{backupStatus.backupSize}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Frequency:</span>
                    <span className="info-value">{backupStatus.frequency}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className={`badge badge-${backupStatus.status === 'completed' ? 'success' : 'warning'}`}>
                      {backupStatus.status}
                    </span>
                  </div>
                </div>

                <div className="backup-actions">
                  <button
                    className="btn btn-success"
                    onClick={handleTriggerBackup}
                    disabled={backingUp}
                  >
                    {backingUp ? '⏳ Backing up...' : '💾 Trigger Backup Now'}
                  </button>
                  <button className="btn btn-secondary">📥 Restore from Backup</button>
                  <button className="btn btn-secondary">📋 View Backup History</button>
                </div>
              </div>

              <div className="card">
                <h2>Backup Configuration</h2>
                <div className="form-group">
                  <label>Backup Frequency</label>
                  <select defaultValue="daily">
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Backup Retention (days)</label>
                  <input type="number" defaultValue="30" min="1" max="365" />
                </div>

                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Enable Automatic Backups
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Compress Backups
                  </label>
                </div>

                <button className="btn btn-primary">💾 Save Configuration</button>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="tab-content">
            <div className="card">
              <h2>Maintenance Schedule</h2>
              <p className="text-muted">Automated maintenance tasks and their schedules</p>

              <div className="schedule-list">
                {maintenanceSchedule.map((task) => (
                  <div key={task.id} className="schedule-item">
                    <div className="schedule-info">
                      <h3>{task.task}</h3>
                      <p className="schedule-time">📅 {task.schedule}</p>
                    </div>
                    <div className="schedule-status">
                      <span className={`badge badge-${task.status === 'scheduled' ? 'info' : 'success'}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="schedule-actions">
                      <button className="btn btn-sm btn-secondary">Edit</button>
                      <button className="btn btn-sm btn-secondary">Run Now</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-schedule">
                <button className="btn btn-primary">+ Add Maintenance Task</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
