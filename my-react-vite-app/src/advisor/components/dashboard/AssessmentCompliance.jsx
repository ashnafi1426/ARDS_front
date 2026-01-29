import { useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiClock, FiAlertCircle } from 'react-icons/fi';

const AssessmentCompliance = () => {
  const navigate = useNavigate();
  
  // Mock compliance data
  const complianceData = {
    totalStudents: 24,
    completed: 18,
    overdue: 4,
    pending: 2,
    complianceRate: 75, // (completed / total) * 100
    weeklyTarget: 90,
    trend: 'up' // up, down, stable
  };

  const recentSubmissions = [
    {
      studentId: 'STU015',
      studentName: 'Emma Wilson',
      submittedAt: '2024-01-29T14:30:00Z',
      riskScore: 45,
      status: 'completed'
    },
    {
      studentId: 'STU008',
      studentName: 'David Brown',
      submittedAt: '2024-01-29T11:15:00Z',
      riskScore: 62,
      status: 'completed'
    },
    {
      studentId: 'STU012',
      studentName: 'Lisa Garcia',
      submittedAt: '2024-01-29T09:45:00Z',
      riskScore: 38,
      status: 'completed'
    }
  ];

  const overdueStudents = [
    {
      studentId: 'STU005',
      studentName: 'Alex Thompson',
      daysOverdue: 3,
      lastSubmission: '2024-01-22'
    },
    {
      studentId: 'STU011',
      studentName: 'Maria Rodriguez',
      daysOverdue: 2,
      lastSubmission: '2024-01-23'
    }
  ];

  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'text-green-500';
    if (rate >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <FiCheckSquare className="w-5 h-5" />
          <span>Assessment Compliance</span>
        </h3>
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => navigate('/advisor/compliance')}
        >
          View Details
        </button>
      </div>

      {/* Compliance Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="6"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke={complianceData.complianceRate >= 90 ? '#10b981' : complianceData.complianceRate >= 75 ? '#f59e0b' : '#ef4444'}
                strokeWidth="6"
                strokeDasharray={`${(complianceData.complianceRate / 100) * 251} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-xl font-bold ${getComplianceColor(complianceData.complianceRate)}`}>
                  {complianceData.complianceRate}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiCheckSquare className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{complianceData.completed}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiClock className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{complianceData.pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FiAlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{complianceData.overdue}</div>
            <div className="text-xs text-gray-500">Overdue</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Weekly Target: {complianceData.weeklyTarget}%</span>
          <span className={`flex items-center ${complianceData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {complianceData.trend === 'up' ? '↗' : '↘'} Trending {complianceData.trend}
          </span>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Submissions</h4>
        <div className="space-y-2">
          {recentSubmissions.map((submission) => (
            <div key={submission.studentId} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                <div className="text-xs text-gray-500">{formatTime(submission.submittedAt)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Risk: {submission.riskScore}</span>
                <FiCheckSquare className="w-4 h-4 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overdue Students */}
      {overdueStudents.length > 0 && (
        <div className="mb-6">
          <h4 className="flex items-center space-x-2 text-sm font-medium text-gray-900 mb-3">
            <FiAlertCircle className="w-4 h-4 text-red-500" />
            <span>Overdue Students</span>
          </h4>
          <div className="space-y-2">
            {overdueStudents.map((student) => (
              <div key={student.studentId} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                  <div className="text-xs text-red-600">{student.daysOverdue} days overdue</div>
                </div>
                <button 
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                  onClick={() => navigate(`/advisor/students/${student.studentId}`)}
                >
                  Send Reminder
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <button 
          className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          onClick={() => navigate('/advisor/compliance')}
        >
          Manage Compliance
        </button>
      </div>
    </div>
  );
};

export default AssessmentCompliance;