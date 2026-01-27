import { useState, useEffect } from 'react';
import api from '../../config/api';

const StudentDashboardRedesigned = () => {
  const [studentData, setStudentData] = useState({
    firstName: 'Admin',
    gpa: 3.2,
    year: 3,
    program: 'Computer Science'
  });
  
  const [stats, setStats] = useState({
    totalStudents: 5432,
    atRiskStudents: 128,
    activeAdvisors: 45,
    systemAlerts: 3
  });

  const [riskThresholds, setRiskThresholds] = useState({
    attendance: 30,
    assignment: 25,
    gpaTrend: 20,
    stressLevel: 25
  });

  const [systemHealth, setSystemHealth] = useState({
    serverStatus: 'Online',
    apiRequests: 1234,
    notificationQueue: 4
  });

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, type: 'high', title: 'High Risk Alert', message: 'Student ID 1023', time: '1 min ago' },
    { id: 2, type: 'warning', title: 'Server Usage Warning', message: 'CPU usage at 85%', time: '15 mins ago' },
    { id: 3, type: 'critical', title: 'Critical Risk Alert', message: 'Student ID 2045', time: '1 hour ago' }
  ]);

  const [userManagement, setUserManagement] = useState({
    students: 5432,
    advisors: 112,
    courses: 78
  });

  const [atRiskDistribution, setAtRiskDistribution] = useState([
    { level: 'Low', count: 320, color: '#22c55e' },
    { level: 'Medium', count: 94, color: '#f59e0b' },
    { level: 'High', count: 25, color: '#ef4444' },
    { level: 'Critical', count: 15, color: '#991b1b' },
    { level: 'Severe', count: 9, color: '#7c2d12' }
  ]);

  const handleThresholdChange = (key, value) => {
    setRiskThresholds(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveChanges = () => {
    alert('Risk threshold configuration saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {studentData.firstName}!</h1>
          <p className="text-gray-600 mt-2">Today: June 13, 2026</p>
        </div>

        {/* Primary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">At-Risk Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.atRiskStudents}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Advisors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeAdvisors}</p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">System Alerts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.systemAlerts}</p>
              </div>
              <div className="text-4xl">🔔</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Threshold Configuration */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Risk Threshold Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendance Weight: {riskThresholds.attendance}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskThresholds.attendance}
                  onChange={(e) => handleThresholdChange('attendance', parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Weight: {riskThresholds.assignment}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskThresholds.assignment}
                  onChange={(e) => handleThresholdChange('assignment', parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA Trend Weight: {riskThresholds.gpaTrend}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskThresholds.gpaTrend}
                  onChange={(e) => handleThresholdChange('gpaTrend', parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level Weight: {riskThresholds.stressLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskThresholds.stressLevel}
                  onChange={(e) => handleThresholdChange('stressLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Threshold Values:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Low: &lt; 30</li>
                  <li>• Medium: 30-60</li>
                  <li>• High: 61-80</li>
                  <li>• Critical: &gt; 80</li>
                </ul>
              </div>

              <button
                onClick={handleSaveChanges}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* System Overview & Recent Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Server Status:</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-medium text-green-600">{systemHealth.serverStatus}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">API Requests Today:</span>
                  <span className="font-medium text-gray-900">{systemHealth.apiRequests.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Notification Queue:</span>
                  <span className="font-medium text-gray-900">{systemHealth.notificationQueue} Pending</span>
                </div>
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                View Logs &gt;
              </button>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Alerts</h2>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      alert.type === 'high' ? 'bg-red-100 text-red-800' :
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {alert.type.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All &gt;
              </button>
            </div>
          </div>
        </div>

        {/* User Management & At-Risk Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userManagement.students.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Students</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 text-sm">
                  Manage
                </button>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userManagement.advisors}</p>
                <p className="text-sm text-gray-600 mt-1">Advisors</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 text-sm">
                  Manage
                </button>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userManagement.courses}</p>
                <p className="text-sm text-gray-600 mt-1">Courses</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 text-sm">
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* At-Risk Students Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">At-Risk Students Overview</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 text-sm">
                Download Report
              </button>
            </div>
            
            <div className="flex items-end gap-4 h-48">
              {atRiskDistribution.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{item.count}</div>
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(item.count / 320) * 100}px`,
                      backgroundColor: item.color
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2 text-center">{item.level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardRedesigned;
