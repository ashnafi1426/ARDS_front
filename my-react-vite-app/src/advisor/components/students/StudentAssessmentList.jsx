import { useState } from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiCalendar } from 'react-icons/fi';

const StudentAssessmentList = ({ studentId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Mock assessment data
  const assessments = [
    {
      id: 1,
      date: '2024-01-29',
      type: 'weekly',
      status: 'completed',
      riskScore: 85,
      responses: {
        stressLevel: 4,
        studyHours: 2,
        workloadDifficulty: 5,
        sleepQuality: 2,
        financialConcern: 4,
        motivationLevel: 2,
        attendanceRate: 'RARELY_BELOW_50',
        assignmentCompletion: 'SOME_COMPLETED',
        comments: 'Struggling with multiple assignments and feeling overwhelmed.'
      }
    },
    {
      id: 2,
      date: '2024-01-22',
      type: 'weekly',
      status: 'completed',
      riskScore: 78,
      responses: {
        stressLevel: 4,
        studyHours: 3,
        workloadDifficulty: 4,
        sleepQuality: 3,
        financialConcern: 3,
        motivationLevel: 2,
        attendanceRate: 'SOME_50_74',
        assignmentCompletion: 'SOME_COMPLETED',
        comments: 'Still having trouble keeping up with coursework.'
      }
    },
    {
      id: 3,
      date: '2024-01-15',
      type: 'weekly',
      status: 'completed',
      riskScore: 72,
      responses: {
        stressLevel: 3,
        studyHours: 4,
        workloadDifficulty: 4,
        sleepQuality: 3,
        financialConcern: 3,
        motivationLevel: 3,
        attendanceRate: 'SOME_50_74',
        assignmentCompletion: 'MOST_COMPLETED',
        comments: 'Feeling better but still stressed about finances.'
      }
    },
    {
      id: 4,
      date: '2024-01-08',
      type: 'weekly',
      status: 'late',
      riskScore: 65,
      submittedDate: '2024-01-10',
      responses: {
        stressLevel: 3,
        studyHours: 5,
        workloadDifficulty: 3,
        sleepQuality: 4,
        financialConcern: 2,
        motivationLevel: 3,
        attendanceRate: 'MOSTLY_75_99',
        assignmentCompletion: 'MOST_COMPLETED',
        comments: 'Starting to get back on track.'
      }
    },
    {
      id: 5,
      date: '2024-01-01',
      type: 'weekly',
      status: 'missed',
      riskScore: null
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="status-icon completed" />;
      case 'late': return <FiClock className="status-icon late" />;
      case 'missed': return <FiAlertTriangle className="status-icon missed" />;
      default: return <FiClock className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'late': return '#f59e0b';
      case 'missed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAttendanceText = (rate) => {
    switch (rate) {
      case 'YES_100': return '100% Attendance';
      case 'MOSTLY_75_99': return '75-99% Attendance';
      case 'SOME_50_74': return '50-74% Attendance';
      case 'RARELY_BELOW_50': return 'Below 50% Attendance';
      default: return 'Not specified';
    }
  };

  const getCompletionText = (completion) => {
    switch (completion) {
      case 'ALL_COMPLETED': return 'All assignments completed';
      case 'MOST_COMPLETED': return 'Most assignments completed';
      case 'SOME_COMPLETED': return 'Some assignments completed';
      case 'NONE_COMPLETED': return 'No assignments completed';
      default: return 'Not specified';
    }
  };

  const filteredAssessments = selectedPeriod === 'all' 
    ? assessments 
    : assessments.filter(assessment => {
        const assessmentDate = new Date(assessment.date);
        const now = new Date();
        const daysDiff = Math.floor((now - assessmentDate) / (1000 * 60 * 60 * 24));
        
        switch (selectedPeriod) {
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case '3months': return daysDiff <= 90;
          default: return true;
        }
      });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900">
          <FiCalendar className="w-5 h-5" />
          <span>Self-Assessment History</span>
        </h3>
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="3months">Last 3 Months</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredAssessments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No assessments found for the selected period</p>
          </div>
        ) : (
          filteredAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{formatDate(assessment.date)}</span>
                    {assessment.submittedDate && assessment.submittedDate !== assessment.date && (
                      <span className="text-xs text-gray-500">
                        (Submitted: {formatDate(assessment.submittedDate)})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)} Assessment
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(assessment.status)}
                    <span 
                      className="text-sm font-medium"
                      style={{ color: getStatusColor(assessment.status) }}
                    >
                      {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                    </span>
                  </div>

                  {assessment.riskScore && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Risk Score:</span>
                      <span className="text-sm font-semibold text-gray-900">{assessment.riskScore}</span>
                    </div>
                  )}
                </div>
              </div>

              {assessment.responses && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stress Level:</span>
                      <span className="text-sm font-medium text-gray-900">{assessment.responses.stressLevel}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Study Hours:</span>
                      <span className="text-sm font-medium text-gray-900">{assessment.responses.studyHours}h/day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Workload Difficulty:</span>
                      <span className="text-sm font-medium text-gray-900">{assessment.responses.workloadDifficulty}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sleep Quality:</span>
                      <span className="text-sm font-medium text-gray-900">{assessment.responses.sleepQuality}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Financial Concern:</span>
                      <span className="text-sm font-medium text-gray-900">{assessment.responses.financialConcern}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Motivation:</span>
                      <span className="text-sm font-medium text-gray-900">{assessment.responses.motivationLevel}/5</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-sm text-gray-600">Attendance:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {getAttendanceText(assessment.responses.attendanceRate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Assignments:</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {getCompletionText(assessment.responses.assignmentCompletion)}
                      </span>
                    </div>
                  </div>

                  {assessment.responses.comments && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600 block mb-2">Comments:</span>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{assessment.responses.comments}</p>
                    </div>
                  )}
                </div>
              )}

              {assessment.status === 'missed' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <FiAlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Assessment was not completed</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <span className="text-sm text-gray-600 block">Completion Rate:</span>
            <span className="text-2xl font-bold text-gray-900">
              {Math.round((assessments.filter(a => a.status === 'completed').length / assessments.length) * 100)}%
            </span>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600 block">Average Risk Score:</span>
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(
                assessments
                  .filter(a => a.riskScore)
                  .reduce((sum, a) => sum + a.riskScore, 0) / 
                assessments.filter(a => a.riskScore).length
              ) || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssessmentList;