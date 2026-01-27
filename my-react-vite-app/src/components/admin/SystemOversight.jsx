import { useState, useEffect } from 'react';

const SystemOversight = () => {
  const [systemHealth, setSystemHealth] = useState({
    serverStatus: 'online',
    databaseStatus: 'connected',
    apiStatus: 'operational',
    emailService: 'active',
    backupStatus: 'completed',
    lastBackup: '2024-01-25 02:00 AM',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    activeUsers: 156,
    totalRequests: 12450,
    errorRate: 0.2,
    avgResponseTime: 145
  });

  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Email Notifications',
      provider: 'SendGrid',
      status: 'active',
      lastSync: '2024-01-25 10:30 AM',
      messagesProcessed: 1250
    },
    {
      id: 2,
      name: 'SMS Alerts',
      provider: 'Twilio',
      status: 'active',
      lastSync: '2024-01-25 10:25 AM',
      messagesProcessed: 340
    },
    {
      id: 3,
      name: 'Calendar Integration',
      provider: 'Google Calendar',
      status: 'active',
      lastSync: '2024-01-25 09:15 AM',
      eventsProcessed: 85
    },
    {
      id: 4,
      name: 'Data Analytics',
      provider: 'Mixpanel',
      status: 'inactive',
      lastSync: '2024-01-24 11:00 PM',
      eventsProcessed: 0
    }
  ]);

  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2024-01-25 10:45 AM', level: 'info', message: 'User login successful', user: 'admin@university.edu' },
    { id: 2, timestamp: '2024-01-25 10:40 AM', level: 'warning', message: 'High memory usage detected', user: 'System' },
    { id: 3, timestamp: '2024-01-25 10:35 AM', level: 'info', message: 'Database backup completed', user: 'System' },
    { id: 4, timestamp: '2024-01-25 10:30 AM', level: 'error', message: 'Email service timeout', user: 'System' },
    { id: 5, timestamp: '2024-01-25 10:25 AM', level: 'info', message: 'Student data updated', user: 'admin@university.edu' }
  ]);

  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      online: 'bg-green-100 text-green-800',
      connected: 'bg-green-100 text-green-800',
      operational: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      offline: 'bg-red-100 text-red-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getLogLevelColor = (level) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getUsageColor = (usage) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleIntegrationToggle = (id) => {
    setIntegrations(integrations.map(i =>
      i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
    ));
  };

  const openIntegrationModal = (integration) => {
    setSelectedIntegration(integration);
    setShowIntegrationModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">System Oversight</h2>
        <p className="text-gray-600 mt-2">Monitor system health, performance, and integrations</p>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Server Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{systemHealth.serverStatus.toUpperCase()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(systemHealth.serverStatus)}`}>
              ✓ Active
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Database</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{systemHealth.databaseStatus.toUpperCase()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(systemHealth.databaseStatus)}`}>
              ✓ Connected
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">API Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{systemHealth.apiStatus.toUpperCase()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(systemHealth.apiStatus)}`}>
              ✓ Operational
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Email Service</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{systemHealth.emailService.toUpperCase()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(systemHealth.emailService)}`}>
              ✓ Active
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">CPU Usage</p>
              <p className="text-sm font-bold text-gray-900">{systemHealth.cpuUsage}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageColor(systemHealth.cpuUsage)}`}
                style={{ width: `${systemHealth.cpuUsage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Memory Usage</p>
              <p className="text-sm font-bold text-gray-900">{systemHealth.memoryUsage}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageColor(systemHealth.memoryUsage)}`}
                style={{ width: `${systemHealth.memoryUsage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Disk Usage</p>
              <p className="text-sm font-bold text-gray-900">{systemHealth.diskUsage}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageColor(systemHealth.diskUsage)}`}
                style={{ width: `${systemHealth.diskUsage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Avg Response Time</p>
            <p className="text-2xl font-bold text-gray-900">{systemHealth.avgResponseTime}ms</p>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-semibold">Active Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{systemHealth.activeUsers}</p>
          <p className="text-xs text-gray-500 mt-2">Currently online</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-semibold">Total Requests (24h)</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{systemHealth.totalRequests.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">API requests processed</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-semibold">Error Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{systemHealth.errorRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Last 24 hours</p>
        </div>
      </div>

      {/* Backup Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Backup Status</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 font-semibold">Last Backup</p>
            <p className="text-lg font-semibold text-gray-900 mt-2">{systemHealth.lastBackup}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(systemHealth.backupStatus)}`}>
              {systemHealth.backupStatus.charAt(0).toUpperCase() + systemHealth.backupStatus.slice(1)}
            </span>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Run Backup Now
          </button>
        </div>
      </div>

      {/* Third-Party Integrations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Third-Party Integrations</h3>
        <div className="space-y-4">
          {integrations.map(integration => (
            <div key={integration.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{integration.name}</p>
                <p className="text-sm text-gray-600">{integration.provider}</p>
                <p className="text-xs text-gray-500 mt-1">Last sync: {integration.lastSync}</p>
              </div>
              <div className="text-right mr-4">
                <p className="text-sm font-semibold text-gray-900">{integration.messagesProcessed}</p>
                <p className="text-xs text-gray-600">processed</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(integration.status)}`}>
                  {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                </span>
                <button
                  onClick={() => openIntegrationModal(integration)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent System Logs</h3>
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLogLevelColor(log.level)} flex-shrink-0`}>
                {log.level.toUpperCase()}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{log.message}</p>
                <p className="text-xs text-gray-600 mt-1">{log.timestamp} • {log.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Configuration Modal */}
      {showIntegrationModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{selectedIntegration.name}</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Provider</p>
                <p className="text-lg font-semibold text-gray-900">{selectedIntegration.provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedIntegration.status)}`}>
                  {selectedIntegration.status.charAt(0).toUpperCase() + selectedIntegration.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Last Sync</p>
                <p className="text-sm text-gray-900">{selectedIntegration.lastSync}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowIntegrationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleIntegrationToggle(selectedIntegration.id);
                  setShowIntegrationModal(false);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white ${
                  selectedIntegration.status === 'active'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedIntegration.status === 'active' ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemOversight;
