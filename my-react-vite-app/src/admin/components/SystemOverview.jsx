import '../styles/system-overview.css';

const SystemOverview = ({ status }) => {
  const getStatusColor = (status) => {
    if (status === 'Online' || status === 'Connected' || status === 'Operational') {
      return 'success';
    }
    return 'error';
  };

  return (
    <div className="card">
      <h2>System Status</h2>
      <div className="status-list">
        {Object.entries(status).map(([key, value]) => (
          <div key={key} className="status-item">
            <span className="status-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <span className={`status-badge status-${getStatusColor(value)}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemOverview;
