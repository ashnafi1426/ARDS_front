import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiUser, FiArrowRight } from 'react-icons/fi';

const HighRiskStudents = () => {
  const navigate = useNavigate();

  // Mock high-risk students data
  const highRiskStudents = [
    {
      id: 'STU001',
      name: 'John Doe',
      riskLevel: 'critical',
      riskScore: 85,
      lastAssessment: '2024-01-25',
      issues: ['Low GPA', 'Poor Attendance', 'Missing Assignments'],
      avatar: null
    },
    {
      id: 'STU002',
      name: 'Sarah Johnson',
      riskLevel: 'high',
      riskScore: 72,
      lastAssessment: '2024-01-26',
      issues: ['Stress Level High', 'Financial Concerns'],
      avatar: null
    },
    {
      id: 'STU003',
      name: 'Mike Chen',
      riskLevel: 'high',
      riskScore: 68,
      lastAssessment: '2024-01-24',
      issues: ['Low Motivation', 'Course Difficulty'],
      avatar: null
    }
  ];

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewStudent = (studentId) => {
    navigate(`/advisor/students/${studentId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <FiAlertTriangle className="w-5 h-5 text-red-500" />
          <span>High Risk Students</span>
        </h3>
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => navigate('/advisor/students?filter=high-risk')}
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {highRiskStudents.length === 0 ? (
          <div className="text-center py-8">
            <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No high-risk students at this time</p>
          </div>
        ) : (
          highRiskStudents.map((student) => (
            <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <FiUser className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-500">{student.id}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskBadgeColor(student.riskLevel)}`}>
                        {student.riskLevel.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">Score: {student.riskScore}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => handleViewStudent(student.id)}
                >
                  <span>View</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Key Issues:</p>
                <div className="flex flex-wrap gap-1">
                  {student.issues.slice(0, 2).map((issue, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {issue}
                    </span>
                  ))}
                  {student.issues.length > 2 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{student.issues.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Last assessment: {new Date(student.lastAssessment).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {highRiskStudents.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button 
            className="w-full bg-red-50 text-red-700 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium"
            onClick={() => navigate('/advisor/alerts')}
          >
            Review All Alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default HighRiskStudents;