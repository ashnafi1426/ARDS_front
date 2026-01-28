import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const SystemMonitoring = () => {
  const [systemStatus, setSystemStatus] = useState({
    server: 'online',
    database: 'connected',
    api: 'operational',
    email: 'active',
    storage: 65
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/system/status');
      if (response.data.status === 'success') {
        setSystemStatus(response.data.data);
        setMetrics(response.data.metrics || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError('Failed to load system status');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'operational':
      case 'active':
        return 'success';
      case 'warning':
        return 'warning';
      case 'offline':
      case 'disconnected':
      case 'error':
        return 'danger';
      default:
        return 'info';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>System Monitoring</h1>
        <p>Monitor system health and performance metrics</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-controls">
        <button className="btn btn-primary" onClick={fetchSystemStatus}>
          🔄 Refresh Status
        </button>
      </div>

      <div className="system-status-grid">
        <div className="status-card">
          <div className="status-header">
            <h3>Server Status</h3>
            <span className={`status-badge badge-${getStatusColor(systemStatus.server)}`}>
              {systemStatus.server.toUpperCase()}
            </span>
          </div>
          <div className="status-details">
            <p>Primary server is {systemStatus.server}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="status-header">
            <h3>Database</h3>
            <span className={`status-badge badge-${getStatusColor(systemStatus.database)}`}>
              {systemStatus.database.toUpperCase()}
            </span>
          </div>
          <div className="status-details">
            <p>Database connection is {systemStatus.database}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="status-header">
            <h3>API Status</h3>
            <span className={`status-badge badge-${getStatusColor(systemStatus.api)}`}>
              {systemStatus.api.toUpperCase()}
            </span>
          </div>
          <div className="status-details">
            <p>API endpoints are {systemStatus.api}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="status-header">
            <h3>Email Service</h3>
            <span className={`status-badge badge-${getStatusColor(systemStatus.email)}`}>
              {systemStatus.email.toUpperCase()}
            </span>
          </div>
          <div className="status-details">
            <p>Email service is {systemStatus.email}</p>
          </div>
        </div>
      </div>

      <div className="metrics-section">
        <h2>Performance Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Storage Usage</div>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: `${systemStatus.storage}%` }}></div>
            </div>
            <div className="metric-value">{systemStatus.storage}%</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">CPU Usage</div>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '45%' }}></div>
            </div>
            <div className="metric-value">45%</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Memory Usage</div>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '62%' }}></div>
            </div>
            <div className="metric-value">62%</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Network I/O</div>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '38%' }}></div>
            </div>
            <div className="metric-value">38%</div>
          </div>
        </div>
      </div>

      <div className="logs-section">
        <h2>Recent System Logs</h2>
        <div className="logs-container">
          {metrics.length > 0 ? (
            <ul className="logs-list">
              {metrics.map((metric, idx) => (
                <li key={idx} className="log-entry">
                  <span className="log-time">{new Date(metric.timestamp).toLocaleTimeString()}</span>
                  <span className="log-message">{metric.message}</span>
                  <span className={`log-level badge-${metric.level || 'info'}`}>
                    {metric.level || 'INFO'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No recent logs</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;
