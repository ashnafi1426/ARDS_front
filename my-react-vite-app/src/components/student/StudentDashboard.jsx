import { useState, useEffect } from 'react';
import api from '../../config/api';
import StudentProfileTab from './StudentProfileTab';
import SelfAssessment from './SelfAssessment';
import RiskStatus from './RiskStatus';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState({});
  const [riskData, setRiskData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Tab definitions
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'questionnaire', label: 'Self-Assessment', icon: '📝' },
    { id: 'risk', label: 'Risk Status', icon: '⚠️' },
    { id: 'progress', label: 'Progress', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'communication', label: 'Advisor', icon: '💬' },
    { id: 'reports', label: 'Reports', icon: '📄' }
  ];

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      // Mock student data - replace with actual API calls
      const mockStudentData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@university.edu',
        studentId: 'STU-001',
        program: 'Computer Science',
        year: 3,
        gpa: 3.2,
        phone: '+1234567890',
        address: '123 University Ave, Campus Town',
        profilePicture: null
      };

      const mockRiskData = {
        currentRiskLevel: 'moderate',
        riskScore: 0.65,
        riskFactors: {
          attendance: 0.7,
          studyHours: 0.6,
          assignments: 0.8,
          participation: 0.5,
          stress: 0.8,
          sleep: 0.4,
          socialSupport: 0.7,
          financial: 0.6
        },
        historicalData: [
          { date: '2024-01-01', score: 0.45, level: 'low' },
          { date: '2024-01-15', score: 0.55, level: 'moderate' },
          { date: '2024-02-01', score: 0.65, level: 'moderate' },
          { date: '2024-02-15', score: 0.72, level: 'high' },
          { date: '2024-03-01', score: 0.65, level: 'moderate' }
        ]
      };

      const mockNotifications = [
        {
          id: 1,
          title: 'New Assessment Due',
          message: 'Complete your weekly self-assessment questionnaire',
          type: 'assessment',
          priority: 'high',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: 2,
          title: 'Risk Score Alert',
          message: 'Your risk score has increased to moderate level',
          type: 'risk',
          priority: 'medium',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          read: true
        },
        {
          id: 3,
          title: 'Advisor Recommendation',
          message: 'Dr. Smith recommends increasing study hours to 20/week',
          type: 'advisor',
          priority: 'medium',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          read: false
        }
      ];

      const mockProgressData = [
        { week: 1, riskScore: 0.45, studyHours: 15, assignments: 4 },
        { week: 2, riskScore: 0.55, studyHours: 12, assignments: 3 },
        { week: 3, riskScore: 0.65, studyHours: 10, assignments: 2 },
        { week: 4, riskScore: 0.72, studyHours: 8, assignments: 2 },
        { week: 5, riskScore: 0.65, studyHours: 14, assignments: 4 },
        { week: 6, riskScore: 0.58, studyHours: 16, assignments: 5 }
      ];

      setStudentData(mockStudentData);
      setRiskData(mockRiskData);
      setNotifications(mockNotifications);
      setProgressData(mockProgressData);
    } catch (error) {
      setError('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      setError('Failed to update notification');
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      low: 'text-green-400 bg-green-900/20',
      moderate: 'text-yellow-400 bg-yellow-900/20',
      high: 'text-red-400 bg-red-900/20'
    };
    return colors[level] || 'text-gray-400 bg-gray-900/20';
  };

  const getRiskProgressColor = (score) => {
    if (score < 0.4) return 'bg-green-500';
    if (score < 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {studentData.firstName}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full ${getRiskColor(riskData.currentRiskLevel)}`}>
              <span className="font-medium capitalize">{riskData.currentRiskLevel} Risk</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white border-t border-l border-r border-gray-700'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-semibold">Oops! Something went wrong</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Overview</h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl shadow-lg border border-blue-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-white">{(riskData.riskScore * 100).toFixed(0)}%</div>
                      <div className="text-sm mt-2 text-blue-200">Risk Score</div>
                    </div>
                    <div className="text-4xl opacity-50">⚠️</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl shadow-lg border border-green-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-white">{studentData.gpa?.toFixed(2)}</div>
                      <div className="text-sm mt-2 text-green-200">Current GPA</div>
                    </div>
                    <div className="text-4xl opacity-50">🎓</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl shadow-lg border border-purple-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-white">{notifications.filter(n => !n.read).length}</div>
                      <div className="text-sm mt-2 text-purple-200">Unread</div>
                    </div>
                    <div className="text-4xl opacity-50">🔔</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-6 rounded-xl shadow-lg border border-orange-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-white">Year {studentData.year}</div>
                      <div className="text-sm mt-2 text-orange-200">{studentData.program}</div>
                    </div>
                    <div className="text-4xl opacity-50">📚</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Assessment completed 2 days ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Risk score increased to moderate</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">New message from advisor</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && <StudentProfileTab />}

          {activeTab === 'questionnaire' && <SelfAssessment />}

          {activeTab === 'risk' && <RiskStatus />}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Progress Tracking</h2>
              
              {/* Progress Chart */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Risk Score Trends</h3>
                <div className="space-y-3">
                  {progressData.map((week, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-gray-400 w-12">Week {week.week}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-6">
                        <div 
                          className={`h-6 rounded-full transition-all duration-500 ${getRiskProgressColor(week.riskScore)}`}
                          style={{ width: `${week.riskScore * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-300 w-16 text-right">{(week.riskScore * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Notifications</h2>
              
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">{notification.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.priority === 'high' ? 'bg-red-900 text-red-200' :
                        notification.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-blue-900 text-blue-200'
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkNotificationRead(notification.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Advisor Communication</h2>
              
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Your Academic Advisor</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Dr. Sarah Smith</h4>
                    <p className="text-gray-400">Computer Science Department</p>
                    <p className="text-gray-400">sarah.smith@university.edu</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    💬 Send Message
                  </button>
                  <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    📅 Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Reports & Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Personal Risk Report</h3>
                  <p className="text-gray-400 mb-4">Comprehensive analysis of your academic risk factors</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    📄 Download Report
                  </button>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Actionable Recommendations</h3>
                  <ul className="text-gray-300 space-y-2 mb-4">
                    <li>• Increase study hours to 20/week</li>
                    <li>• Join study groups for better engagement</li>
                    <li>• Practice stress management techniques</li>
                    <li>• Improve sleep schedule (7-8 hours)</li>
                  </ul>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    ✅ Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
