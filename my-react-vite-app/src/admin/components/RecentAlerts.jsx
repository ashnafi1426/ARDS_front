import '../styles/recent-alerts.css';

const RecentAlerts = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="card">
      <h2>Recent Alerts</h2>
      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item alert-${alert.type}`}>
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-content">
              <p className="alert-message">{alert.message}</p>
              <p className="alert-time">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;
