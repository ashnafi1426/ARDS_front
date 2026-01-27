import { useState, useEffect } from 'react';

const ConfigurationManagement = ({ setSuccess, setError }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('risk');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      
      // Mock configuration data - replace with actual API calls
      const configData = {
        riskThresholds: {
          low: { min: 0, max: 0.3, color: '#10b981', label: 'Low Risk' },
          medium: { min: 0.3, max: 0.6, color: '#f59e0b', label: 'Medium Risk' },
          high: { min: 0.6, max: 0.8, color: '#ef4444', label: 'High Risk' },
          critical: { min: 0.8, max: 1.0, color: '#8b5cf6', label: 'Critical Risk' }
        },
        notificationSettings: {
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          emailRecipients: ['admin@university.edu', 'support@university.edu'],
          smsRecipients: [],
          riskAlerts: {
            low: false,
            medium: true,
            high: true,
            critical: true
          },
          dailyDigest: true,
          weeklyReport: true
        },
        systemSettings: {
          maxLoginAttempts: 5,
          sessionTimeout: 30,
          passwordMinLength: 8,
          requireStrongPassword: true,
          dataRetentionDays: 365,
          backupFrequency: 'daily',
          maintenanceWindow: '02:00-04:00'
        },
        questionnaireSettings: {
          gpaWeight: 0.3,
          attendanceWeight: 0.25,
          assignmentWeight: 0.25,
          engagementWeight: 0.2,
          updateFrequency: 'weekly',
          autoAssign: true,
          reminderDays: [1, 3, 7]
        },
        permissions: {
          admin: ['read', 'write', 'delete', 'manage_users', 'manage_system'],
          advisor: ['read', 'write', 'manage_students'],
          student: ['read', 'update_profile']
        }
      };

      setConfig(configData);
    } catch (error) {
      setError('Failed to fetch configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (section, data) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfig(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }));
      setSuccess('Configuration updated successfully');
      setHasChanges(false);
    } catch (error) {
      setError('Failed to update configuration');
    }
  };

  const handleRiskThresholdChange = (level, field, value) => {
    setConfig(prev => ({
      ...prev,
      riskThresholds: {
        ...prev.riskThresholds,
        [level]: {
          ...prev.riskThresholds[level],
          [field]: field === 'color' || field === 'label' ? value : parseFloat(value)
        }
      }
    }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSystemSettingChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        [field]: field === 'maxLoginAttempts' || field === 'sessionTimeout' || field === 'passwordMinLength' || field === 'dataRetentionDays' 
          ? parseInt(value) 
          : value
      }
    }));
    setHasChanges(true);
  };

  const handleQuestionnaireChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      questionnaireSettings: {
        ...prev.questionnaireSettings,
        [field]: field === 'gpaWeight' || field === 'attendanceWeight' || field === 'assignmentWeight' || field === 'engagementWeight'
          ? parseFloat(value)
          : value
      }
    }));
    setHasChanges(true);
  };

  const handlePermissionChange = (role, permission) => {
    setConfig(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [role]: prev.permissions[role].includes(permission)
          ? prev.permissions[role].filter(p => p !== permission)
          : [...prev.permissions[role], permission]
      }
    }));
    setHasChanges(true);
  };

  const saveAllChanges = async () => {
    try {
      // Mock API call to save all configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('All configurations saved successfully');
      setHasChanges(false);
    } catch (error) {
      setError('Failed to save configurations');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Configuration Management</h2>
        {hasChanges && (
          <div className="flex gap-2">
            <button
              onClick={fetchConfig}
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
            >
              Discard Changes
            </button>
            <button
              onClick={saveAllChanges}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-medium"
            >
              Save All Changes
            </button>
          </div>
        )}
      </div>

      {/* Configuration Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          {['risk', 'notifications', 'system', 'questionnaire', 'permissions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Risk Thresholds Configuration */}
      {activeTab === 'risk' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Risk Thresholds</h3>
          <div className="space-y-6">
            {Object.entries(config.riskThresholds || {}).map(([level, settings]) => (
              <div key={level} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white capitalize">{level} Risk</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.color}
                      onChange={(e) => handleRiskThresholdChange(level, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.label}
                      onChange={(e) => handleRiskThresholdChange(level, 'label', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white rounded px-3 py-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Min Score</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={settings.min}
                      onChange={(e) => handleRiskThresholdChange(level, 'min', e.target.value)}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Max Score</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={settings.max}
                      onChange={(e) => handleRiskThresholdChange(level, 'max', e.target.value)}
                      className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => handleUpdateConfig('riskThresholds', config.riskThresholds)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Risk Thresholds
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Notification Settings</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Notification Channels</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={config.notificationSettings?.emailEnabled}
                      onChange={(e) => handleNotificationChange('emailEnabled', e.target.checked)}
                      className="mr-2"
                    />
                    Email Notifications
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={config.notificationSettings?.smsEnabled}
                      onChange={(e) => handleNotificationChange('smsEnabled', e.target.checked)}
                      className="mr-2"
                    />
                    SMS Notifications
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={config.notificationSettings?.pushEnabled}
                      onChange={(e) => handleNotificationChange('pushEnabled', e.target.checked)}
                      className="mr-2"
                    />
                    Push Notifications
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Risk Level Alerts</h4>
                <div className="space-y-2">
                  {Object.entries(config.notificationSettings?.riskAlerts || {}).map(([level, enabled]) => (
                    <label key={level} className="flex items-center text-white capitalize">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleNotificationChange('riskAlerts', {
                          ...config.notificationSettings.riskAlerts,
                          [level]: e.target.checked
                        })}
                        className="mr-2"
                      />
                      {level} Risk Alerts
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Scheduled Reports</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={config.notificationSettings?.dailyDigest}
                      onChange={(e) => handleNotificationChange('dailyDigest', e.target.checked)}
                      className="mr-2"
                    />
                    Daily Digest
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={config.notificationSettings?.weeklyReport}
                      onChange={(e) => handleNotificationChange('weeklyReport', e.target.checked)}
                      className="mr-2"
                    />
                    Weekly Report
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Recipients</label>
                <textarea
                  value={config.notificationSettings?.emailRecipients?.join(', ')}
                  onChange={(e) => handleNotificationChange('emailRecipients', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  rows={3}
                  placeholder="admin@university.edu, support@university.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">SMS Recipients</label>
                <textarea
                  value={config.notificationSettings?.smsRecipients?.join(', ')}
                  onChange={(e) => handleNotificationChange('smsRecipients', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  rows={3}
                  placeholder="+1234567890, +0987654321"
                />
              </div>
            </div>

            <button
              onClick={() => handleUpdateConfig('notificationSettings', config.notificationSettings)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Notification Settings
            </button>
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">System Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Security Settings</h4>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Max Login Attempts</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.systemSettings?.maxLoginAttempts}
                  onChange={(e) => handleSystemSettingChange('maxLoginAttempts', e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Session Timeout (minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={config.systemSettings?.sessionTimeout}
                  onChange={(e) => handleSystemSettingChange('sessionTimeout', e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password Min Length</label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={config.systemSettings?.passwordMinLength}
                  onChange={(e) => handleSystemSettingChange('passwordMinLength', e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={config.systemSettings?.requireStrongPassword}
                  onChange={(e) => handleSystemSettingChange('requireStrongPassword', e.target.checked)}
                  className="mr-2"
                />
                Require Strong Password
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Data & Backup Settings</h4>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Data Retention Days</label>
                <input
                  type="number"
                  min="30"
                  max="3650"
                  value={config.systemSettings?.dataRetentionDays}
                  onChange={(e) => handleSystemSettingChange('dataRetentionDays', e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Backup Frequency</label>
                <select
                  value={config.systemSettings?.backupFrequency}
                  onChange={(e) => handleSystemSettingChange('backupFrequency', e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Maintenance Window</label>
                <input
                  type="text"
                  value={config.systemSettings?.maintenanceWindow}
                  onChange={(e) => handleSystemSettingChange('maintenanceWindow', e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  placeholder="02:00-04:00"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => handleUpdateConfig('systemSettings', config.systemSettings)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update System Settings
          </button>
        </div>
      )}

      {/* Questionnaire Settings */}
      {activeTab === 'questionnaire' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Questionnaire Settings</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Risk Calculation Weights</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">GPA Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={config.questionnaireSettings?.gpaWeight}
                    onChange={(e) => handleQuestionnaireChange('gpaWeight', e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Attendance Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={config.questionnaireSettings?.attendanceWeight}
                    onChange={(e) => handleQuestionnaireChange('attendanceWeight', e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Assignment Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={config.questionnaireSettings?.assignmentWeight}
                    onChange={(e) => handleQuestionnaireChange('assignmentWeight', e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Engagement Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={config.questionnaireSettings?.engagementWeight}
                    onChange={(e) => handleQuestionnaireChange('engagementWeight', e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Update Frequency</label>
                <select
                  value={config.questionnaireSettings?.updateFrequency}
                  onChange={(e) => handleQuestionnaireChange('updateFrequency', e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.questionnaireSettings?.autoAssign}
                  onChange={(e) => handleQuestionnaireChange('autoAssign', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-white">Auto-assign Advisors</label>
              </div>
            </div>

            <button
              onClick={() => handleUpdateConfig('questionnaireSettings', config.questionnaireSettings)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Questionnaire Settings
            </button>
          </div>
        </div>
      )}

      {/* Permissions */}
      {activeTab === 'permissions' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Role-Based Permissions</h3>
          <div className="space-y-6">
            {Object.entries(config.permissions || {}).map(([role, permissions]) => (
              <div key={role} className="border border-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white capitalize mb-4">{role} Permissions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['read', 'write', 'delete', 'manage_users', 'manage_system', 'manage_students', 'update_profile'].map((permission) => (
                    <label key={permission} className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={permissions.includes(permission)}
                        onChange={() => handlePermissionChange(role, permission)}
                        className="mr-2"
                      />
                      <span className="text-sm">{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => handleUpdateConfig('permissions', config.permissions)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Permissions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationManagement;
