import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GPATrendChart from './GPATrendChart';
import AttendanceTrendChart from './AttendanceTrendChart';
import AcademicCalendar from './AcademicCalendar';

const StudentOverviewRedesigned = ({ studentData, riskData, onRefresh }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'self-check', label: 'Self-Check', icon: '📝' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '⚙️' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'self-check') navigate('/student/self-check');
    if (tabId === 'profile') navigate('/student/profile');
  };

  // Mock data
  const riskStatus = {
    level: 'Low Risk',
    color: 'green',
    lastAssessment: 'Never'
  };

  const primaryCards = [
    { title: 'Risk Status', value: riskStatus.level, icon: '🛡️', color: 'green' },
    { title: 'Current GPA', value: (studentData?.gpa || 3.2).toFixed(2), icon: '✓', color: 'blue' },
    { title: 'Attendance Rate', value: '100%', icon: '✓', color: 'green' }
  ];

  const secondaryStats = [
    { label: 'Current GPA', value: '3.20', icon: '📊', color: 'blue' },
    { label: 'Attendance Rate', value: '100%', icon: '✓', color: 'green' },
    { label: 'Assignment Rate', value: '100/0', icon: '📝', color: 'orange' },
    { label: 'Current Year', value: '3', icon: '📚', color: 'purple' }
  ];

  const quickStats = [
    { title: 'Backup Completed', badge: 'NEW', time: '2 hours ago', icon: '💾' },
    { title: 'Weekly Report Available', badge: 'NEW', time: '1 day ago', icon: '📄' },
    { title: 'High Risk Students Alert', time: '3 days ago', icon: '⚠️' }
  ];

  const recentAlerts = [
    { type: 'high', title: 'High Risk Alert', message: 'Student ID 1023', time: '1 min ago' },
    { type: 'warning', title: 'Server Usage Warning', message: 'CPU usage at 85%', time: '15 mins ago' },
    { type: 'critical', title: 'Critical Risk Alert', message: 'Student ID 2045', time: '1 hour ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {studentData?.firstName || 'Student'}!</h1>
          <p className="text-gray-600 mt-2">Here's your academic overview</p>
        </div>

        {/* Primary Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {primaryCards.map((card, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${
              card.color === 'green' ? 'from-green-500 to-green-600' :
              card.color === 'blue' ? 'from-blue-500 to-blue-600' :
              'from-purple-500 to-purple-600'
            } rounded-lg shadow-lg p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                  {card.title === 'Risk Status' && (
                    <p className="text-xs mt-2 opacity-75">Last Risk Assessment: {riskStatus.lastAssessment}</p>
                  )}
                </div>
                <div className="text-4xl opacity-50">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {secondaryStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'orange' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats Notifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{stat.icon}</div>
                    {stat.badge && (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{stat.time}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* GPA Trend Chart */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">GPA Trend Chart</h2>
                  <select className="text-sm border border-gray-300 rounded px-3 py-1">
                    <option>Last 6 months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <GPATrendChart studentId={studentData?.id} riskData={riskData} />
              </div>

              {/* Attendance Trend Chart */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Trend Chart</h2>
                <AttendanceTrendChart />
              </div>
            </div>

            {/* Academic Calendar & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Academic Calendar */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Academic Calendar</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All →
                  </button>
                </div>
                <AcademicCalendar />
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition">
                    <span className="text-2xl">👥</span>
                    <span className="text-sm font-medium text-gray-900">Manage Users</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                    <span className="text-2xl">👤</span>
                    <span className="text-sm font-medium text-gray-900">View Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition">
                    <span className="text-2xl">🔔</span>
                    <span className="text-sm font-medium text-gray-900">All Notifications</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition">
                    <span className="text-2xl">📖</span>
                    <span className="text-sm font-medium text-gray-900">Academic Resources</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Notifications Panel</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {recentAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <span className={`px-3 py-1 text-xs font-bold rounded ${
                      alert.type === 'high' ? 'bg-red-100 text-red-800' :
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {alert.type.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Content */}
        {activeTab === 'self-check' && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p className="text-gray-600">Self-Check content will be displayed here</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p className="text-gray-600">Profile content will be displayed here</p>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p className="text-gray-600">Account settings will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOverviewRedesigned;
