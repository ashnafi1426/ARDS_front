import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiUser, 
  FiAlertTriangle, 
  FiMessageSquare, 
  FiEdit,
  FiCalendar,
  FiBarChart3,
  FiCheckSquare
} from 'react-icons/fi';
import StudentProfileDrawer from '../components/students/StudentProfileDrawer';
import StudentRiskHistory from '../components/students/StudentRiskHistory';
import StudentAssessmentList from '../components/students/StudentAssessmentList';

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock student data
  const mockStudent = {
    id: 'STU001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Student Ave, College Town, ST 12345',
    department: 'Computer Science',
    yearOfStudy: 3,
    status: 'Active',
    enrollmentDate: '2022-09-01',
    gpa: 1.8,
    credits: 85,
    attendanceRate: 45,
    riskLevel: 'critical',
    riskScore: 85,
    riskTrend: 'up',
    lastAssessment: '2024-01-29',
    assessmentStatus: 'completed',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      relationship: 'Mother'
    },
    avatar: null
  };

  useEffect(() => {
    loadStudentDetails();
  }, [id]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (id === 'STU001') {
        setStudent(mockStudent);
      } else {
        setError('Student not found');
      }
    } catch (err) {
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    navigate(`/advisor/communication?student=${id}`);
  };

  const handleEditStudent = () => {
    // TODO: Implement edit functionality
    console.log('Edit student:', id);
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/advisor/students')}
            className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Students</span>
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Student Not Found</h3>
          <p className="text-gray-600 mb-4">The requested student could not be found.</p>
          <button 
            onClick={() => navigate('/advisor/students')}
            className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Students</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/advisor/students')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Students</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600">{student.id} • {student.department}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleEditStudent}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FiEdit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button 
            onClick={handleSendMessage}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiMessageSquare className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* Risk Alert Banner */}
      {(student.riskLevel === 'critical' || student.riskLevel === 'high') && (
        <div className={`p-4 rounded-lg border ${
          student.riskLevel === 'critical' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiAlertTriangle className={`w-5 h-5 ${
                student.riskLevel === 'critical' ? 'text-red-500' : 'text-orange-500'
              }`} />
              <div>
                <strong className={`${
                  student.riskLevel === 'critical' ? 'text-red-900' : 'text-orange-900'
                }`}>
                  {student.riskLevel === 'critical' ? 'Critical Risk Alert' : 'High Risk Alert'}
                </strong>
                <p className={`${
                  student.riskLevel === 'critical' ? 'text-red-700' : 'text-orange-700'
                }`}>
                  This student requires immediate attention. Risk score: {student.riskScore}
                </p>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              student.riskLevel === 'critical' 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}>
              View Interventions
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Student Profile */}
        <div className="lg:col-span-1 space-y-6">
          <StudentProfileDrawer student={student} />
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Score</span>
                <span className={`text-lg font-semibold ${getRiskColor(student.riskLevel)}`}>
                  {student.riskScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">GPA</span>
                <span className="text-lg font-semibold text-gray-900">{student.gpa}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Attendance</span>
                <span className="text-lg font-semibold text-gray-900">{student.attendanceRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Credits</span>
                <span className="text-lg font-semibold text-gray-900">{student.credits}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button 
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'overview' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <div className="flex items-center space-x-2">
                    <FiBarChart3 className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </button>
                <button 
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'risk-history' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('risk-history')}
                >
                  <div className="flex items-center space-x-2">
                    <FiAlertTriangle className="w-4 h-4" />
                    <span>Risk History</span>
                  </div>
                </button>
                <button 
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'assessments' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('assessments')}
                >
                  <div className="flex items-center space-x-2">
                    <FiCheckSquare className="w-4 h-4" />
                    <span>Assessments</span>
                  </div>
                </button>
                <button 
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'interventions' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('interventions')}
                >
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4" />
                    <span>Interventions</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Performance */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Current GPA</span>
                            <span className="text-lg font-semibold text-gray-900">{student.gpa}</span>
                          </div>
                          <span className="text-xs text-red-600">↓ 0.3 from last semester</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Attendance Rate</span>
                            <span className="text-lg font-semibold text-gray-900">{student.attendanceRate}%</span>
                          </div>
                          <span className="text-xs text-red-600">↓ 15% from last month</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Assignment Completion</span>
                            <span className="text-lg font-semibold text-gray-900">60%</span>
                          </div>
                          <span className="text-xs text-red-600">↓ 25% from last month</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <FiCheckSquare className="w-4 h-4 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">Completed weekly self-assessment</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <FiAlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">Risk score increased to 85</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <FiCalendar className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">Missed CS301 lecture</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Current Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">CS301 - Data Structures</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Attendance:</span>
                            <span className="text-red-600">40%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Grade:</span>
                            <span className="text-red-600">C-</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">CS302 - Algorithms</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Attendance:</span>
                            <span className="text-red-600">50%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Grade:</span>
                            <span className="text-red-600">D+</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">MATH201 - Calculus II</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Attendance:</span>
                            <span className="text-red-600">45%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Grade:</span>
                            <span className="text-red-600">D</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'risk-history' && (
                <StudentRiskHistory studentId={student.id} />
              )}

              {activeTab === 'assessments' && (
                <StudentAssessmentList studentId={student.id} />
              )}

              {activeTab === 'interventions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Interventions & Support</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Add Intervention
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Academic Tutoring</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">Recommended tutoring for CS301 and MATH201</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Recommended: Jan 25, 2024</span>
                        <span>Status: Student contacted tutor</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Financial Aid Counseling</h4>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Pending
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">Referred to financial aid office for assistance</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Recommended: Jan 20, 2024</span>
                        <span>Status: Awaiting student response</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;