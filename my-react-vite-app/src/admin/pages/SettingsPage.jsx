import { useState, useEffect } from 'react';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import '../styles/admin-pages.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    systemName: 'Academic Risk Detection System',
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    backupFrequency: 'daily',
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    riskThresholdGPA: 2.5,
    riskThresholdAttendance: 75,
    riskThresholdAssignment: 60
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/settings');
      if (response.data.status === 'success') {
        setSettings(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      const response = await api.put('/admin/settings', settings);
      if (response.data.status === 'success') {
        setSuccess('Settings saved successfully');
        setHasChanges(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure system settings and preferences</p>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <div className="success-message">{success}</div>}

      <div className="settings-container">
        <div className="settings-section">
          <h2>General Settings</h2>
          <div className="form-group">
            <label>System Name</label>
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => handleSettingChange('systemName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              />
              Maintenance Mode
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notification Settings</h2>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              Enable Email Notifications
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Backup Settings</h2>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              />
              Enable Automatic Backups
            </label>
          </div>

          <div className="form-group">
            <label>Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Security Settings</h2>
          <div className="form-group">
            <label>Max Login Attempts</label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
              min="1"
              max="10"
            />
          </div>

          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="480"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Risk Assessment Thresholds</h2>
          <div className="form-group">
            <label>GPA Threshold</label>
            <input
              type="number"
              value={settings.riskThresholdGPA}
              onChange={(e) => handleSettingChange('riskThresholdGPA', parseFloat(e.target.value))}
              min="0"
              max="4"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Attendance Threshold (%)</label>
            <input
              type="number"
              value={settings.riskThresholdAttendance}
              onChange={(e) => handleSettingChange('riskThresholdAttendance', parseInt(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Assignment Completion Threshold (%)</label>
            <input
              type="number"
              value={settings.riskThresholdAssignment}
              onChange={(e) => handleSettingChange('riskThresholdAssignment', parseInt(e.target.value))}
              min="0"
              max="100"
            />
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
              fetchSettings();
              setHasChanges(false);
            }}
          >
            ↻ Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
