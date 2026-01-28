import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const SecurityPage = () => {
  const [rbacConfig, setRbacConfig] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipWhitelist: false,
    encryptionEnabled: true,
    auditLoggingEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('rbac');

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [rbacRes, auditRes, settingsRes] = await Promise.all([
        api.get('/admin/security/rbac').catch(() => ({ data: { data: [] } })),
        api.get('/admin/security/audit-logs?limit=50').catch(() => ({ data: { data: [] } })),
        api.get('/admin/security/settings').catch(() => ({ data: { data: securitySettings } }))
      ]);

      setRbacConfig(rbacRes.data.data || []);
      setAuditLogs(auditRes.data.data || []);
      if (settingsRes.data.data) {
        setSecuritySettings(settingsRes.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching security data:', err);
      setError('Failed to load security data');
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSecuritySettings({ ...securitySettings, [key]: value });
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      await api.put('/admin/security/settings', securitySettings);
      setSuccess('Security settings saved successfully');
      setHasChanges(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save security settings');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'danger',
      advisor: 'warning',
      student: 'info'
    };
    return colors[role] || 'secondary';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Security & Compliance</h1>
        <p>Manage security settings, roles, and audit logs</p>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="success-message">{success}</div>}

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'rbac' ? 'active' : ''}`}
            onClick={() => setActiveTab('rbac')}
          >
            🔐 RBAC Configuration
          </button>
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Security Settings
          </button>
          <button
            className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            📋 Audit Logs
          </button>
        </div>

        {/* RBAC Configuration Tab */}
        {activeTab === 'rbac' && (
          <div className="tab-content">
            <div className="card">
              <h2>Role-Based Access Control (RBAC)</h2>
              <p className="text-muted">Manage user roles and their permissions</p>

              <div className="rbac-grid">
                {rbacConfig.length > 0 ? (
                  rbacConfig.map((role) => (
                    <div key={role.id} className="rbac-card">
                      <div className="rbac-header">
                        <h3>{role.name}</h3>
                        <span className={`badge badge-${getRoleColor(role.name.toLowerCase())}`}>
                          {role.name}
                        </span>
                      </div>
                      <div className="rbac-permissions">
                        <h4>Permissions:</h4>
                        <ul>
                          {role.permissions && role.permissions.map((perm, idx) => (
                            <li key={idx}>✓ {perm}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rbac-users">
                        <p><strong>Users:</strong> {role.userCount || 0}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No RBAC configuration available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="card">
              <h2>Security Settings</h2>

              <div className="settings-section">
                <h3>Authentication</h3>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    />
                    Enable Two-Factor Authentication
                  </label>
                </div>

                <div className="form-group">
                  <label>Password Expiry (days)</label>
                  <input
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                    min="0"
                    max="365"
                  />
                </div>

                <div className="form-group">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>
              </div>

              <div className="settings-section">
                <h3>Network Security</h3>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={securitySettings.ipWhitelist}
                      onChange={(e) => handleSettingChange('ipWhitelist', e.target.checked)}
                    />
                    Enable IP Whitelist
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Data Protection</h3>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={securitySettings.encryptionEnabled}
                      onChange={(e) => handleSettingChange('encryptionEnabled', e.target.checked)}
                    />
                    Enable Data Encryption
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={securitySettings.auditLoggingEnabled}
                      onChange={(e) => handleSettingChange('auditLoggingEnabled', e.target.checked)}
                    />
                    Enable Audit Logging
                  </label>
                </div>
              </div>

              <div className="settings-actions">
                <button
                  className="btn btn-success"
                  onClick={handleSaveSettings}
                  disabled={!hasChanges}
                >
                  💾 Save Settings
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    fetchSecurityData();
                    setHasChanges(false);
                  }}
                >
                  ↻ Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="tab-content">
            <div className="card">
              <h2>Audit Logs</h2>
              <p className="text-muted">System activity and security events</p>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Status</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                          <td>{log.user || 'System'}</td>
                          <td>{log.action}</td>
                          <td>{log.resource || 'N/A'}</td>
                          <td>
                            <span className={`badge badge-${log.status === 'success' ? 'success' : 'danger'}`}>
                              {log.status}
                            </span>
                          </td>
                          <td>{log.ipAddress || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No audit logs available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
