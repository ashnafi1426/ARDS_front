import { useState, useEffect } from 'react';

const Maintenance = ({ setSuccess, setError }) => {
  const [schedules, setSchedules] = useState([]);
  const [backups, setBackups] = useState([]);
  const [dbStats, setDbStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      
      // Mock maintenance data - replace with actual API calls
      const schedulesData = [
        {
          id: 1,
          name: 'Daily Database Backup',
          type: 'backup',
          frequency: 'daily',
          nextRun: new Date(Date.now() + 3600000 * 2).toISOString(),
          lastRun: new Date(Date.now() - 3600000 * 22).toISOString(),
          status: 'scheduled',
          isActive: true
        },
        {
          id: 2,
          name: 'Weekly System Cleanup',
          type: 'cleanup',
          frequency: 'weekly',
          nextRun: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
          lastRun: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
          status: 'scheduled',
          isActive: true
        },
        {
          id: 3,
          name: 'Monthly Security Scan',
          type: 'security',
          frequency: 'monthly',
          nextRun: new Date(Date.now() + 3600000 * 24 * 15).toISOString(),
          lastRun: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
          status: 'completed',
          isActive: true
        }
      ];

      const backupsData = [
        {
          id: 1,
          name: 'daily_backup_2024-01-25',
          type: 'automated',
          size: '2.3 GB',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'completed',
          location: 'cloud_storage'
        },
        {
          id: 2,
          name: 'weekly_backup_2024-01-21',
          type: 'automated',
          size: '15.7 GB',
          createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
          status: 'completed',
          location: 'cloud_storage'
        },
        {
          id: 3,
          name: 'manual_backup_2024-01-20',
          type: 'manual',
          size: '16.1 GB',
          createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
          status: 'completed',
          location: 'local_storage'
        }
      ];

      const dbStatsData = {
        totalSize: '45.2 GB',
        tableCount: 12,
        indexCount: 28,
        lastOptimized: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        performance: {
          queryTime: '45ms',
          connections: 15,
          uptime: '99.9%'
        },
        storage: {
          used: '45.2 GB',
          available: '954.8 GB',
          total: '1 TB'
        }
      };

      setSchedules(schedulesData);
      setBackups(backupsData);
      setDbStats(dbStatsData);
    } catch (error) {
      setError('Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunBackup = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuccess('Backup completed successfully');
      fetchMaintenanceData();
    } catch (error) {
      setError('Failed to run backup');
    }
  };

  const handleOptimizeDatabase = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      setSuccess('Database optimized successfully');
      fetchMaintenanceData();
    } catch (error) {
      setError('Failed to optimize database');
    }
  };

  const handleCreateSchedule = async (scheduleData) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newSchedule = {
        id: schedules.length + 1,
        ...scheduleData,
        status: 'scheduled',
        isActive: true
      };
      setSchedules([...schedules, newSchedule]);
      setSuccess('Schedule created successfully');
      setShowScheduleForm(false);
    } catch (error) {
      setError('Failed to create schedule');
    }
  };

  const handleToggleSchedule = async (id) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSchedules(schedules.map(s => 
        s.id === id ? { ...s, isActive: !s.isActive } : s
      ));
      setSuccess('Schedule updated successfully');
    } catch (error) {
      setError('Failed to update schedule');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-900 text-blue-200',
      running: 'bg-yellow-900 text-yellow-200',
      completed: 'bg-green-900 text-green-200',
      failed: 'bg-red-900 text-red-200'
    };
    return colors[status] || 'bg-gray-900 text-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading maintenance data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">System Maintenance</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRunBackup}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Run Backup
          </button>
          <button
            onClick={handleOptimizeDatabase}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ⚡ Optimize DB
          </button>
          <button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg font-medium"
          >
            + Schedule Task
          </button>
        </div>
      </div>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Database Size</h3>
          <div className="text-3xl font-bold text-blue-400">{dbStats.totalSize}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Tables</h3>
          <div className="text-3xl font-bold text-green-400">{dbStats.tableCount}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Active Connections</h3>
          <div className="text-3xl font-bold text-yellow-400">{dbStats.performance?.connections}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Query Time</h3>
          <div className="text-3xl font-bold text-purple-400">{dbStats.performance?.queryTime}</div>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Storage Overview</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Used Storage</span>
            <span className="text-white">{dbStats.storage?.used}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${(parseFloat(dbStats.storage?.used) / parseFloat(dbStats.storage?.total?.replace('GB', ''))) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Available Storage</span>
            <span className="text-green-400">{dbStats.storage?.available}</span>
          </div>
        </div>
      </div>

      {/* Maintenance Schedules */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">Maintenance Schedules</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Task Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Next Run</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Last Run</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {schedule.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {schedule.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {schedule.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(schedule.nextRun).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(schedule.lastRun).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleSchedule(schedule.id)}
                        className={`px-2 py-1 text-xs rounded ${
                          schedule.isActive 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button className="text-blue-400 hover:text-blue-300">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">Backup History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Backup Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {backup.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {backup.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(backup.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {backup.location.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        Download
                      </button>
                      <button className="text-green-400 hover:text-green-300">
                        Restore
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Task Form */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-6">Schedule Maintenance Task</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateSchedule({
                name: e.target.name.value,
                type: e.target.type.value,
                frequency: e.target.frequency.value
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Task Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                <select name="type" className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2">
                  <option value="backup">Backup</option>
                  <option value="cleanup">Cleanup</option>
                  <option value="security">Security</option>
                  <option value="optimization">Optimization</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Frequency</label>
                <select name="frequency" className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2">
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;