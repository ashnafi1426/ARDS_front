import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import AssignmentUpload from './AssignmentUpload';
import studentService from '../../services/student.service';
import assignmentService from '../../services/assignment.service';

const AssignmentList = ({ assignments = {}, courseId = null }) => {
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, submitted, missing, late
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
  const [submissions, setSubmissions] = useState({});

  // Fetch assignments for specific course if courseId provided
  useEffect(() => {
    if (courseId) {
      fetchCourseAssignments();
    } else if (assignments && assignments.length > 0) {
      setAssignmentsList(assignments);
    }
    // Fetch submissions
    fetchSubmissions();
  }, [courseId, assignments]);

  const fetchCourseAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentService.getCourseAssignments(courseId);
      if (response.status === 'success' && response.data) {
        setAssignmentsList(response.data);
      }
    } catch (err) {
      setError('Failed to load assignments');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await assignmentService.getStudentSubmissions();
      if (response.status === 'success' && response.data) {
        const submissionsMap = {};
        response.data.forEach(sub => {
          submissionsMap[sub.assignment_id] = sub;
        });
        setSubmissions(submissionsMap);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  // Filter assignments based on status
  const getFilteredAssignments = () => {
    if (filterStatus === 'all') return assignmentsList;
    return assignmentsList.filter(a => a.status.toLowerCase() === filterStatus.toLowerCase());
  };

  // Get status badge color and icon
  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case 'SUBMITTED':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '✓',
          label: 'Submitted',
        };
      case 'LATE':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: '⏱️',
          label: 'Late',
        };
      case 'MISSING':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '✗',
          label: 'Missing',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '?',
          label: 'Unknown',
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if assignment is overdue
  const isOverdue = (dueDate, status) => {
    if (status === 'SUBMITTED') return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  // Get days until due
  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  const filteredAssignments = getFilteredAssignments();

  // Show upload modal if uploadingAssignmentId is set
  if (uploadingAssignmentId) {
    const assignmentToUpload = assignmentsList.find(a => a.assignment_id === uploadingAssignmentId);
    return (
      <div className="space-y-4">
        <button
          onClick={() => setUploadingAssignmentId(null)}
          className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          ← Back to Assignments
        </button>
        <AssignmentUpload
          assignment={assignmentToUpload}
          onSuccess={() => {
            setUploadingAssignmentId(null);
            fetchSubmissions();
          }}
          onCancel={() => setUploadingAssignmentId(null)}
        />
      </div>
    );
  }

  if (!assignmentsList || assignmentsList.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
        <span className="text-3xl mb-2 block">📝</span>
        <p className="text-gray-600">No assignments for this course yet.</p>
      </div>
    );
  }

  // Count assignments by status
  const statusCounts = {
    all: assignmentsList.length,
    submitted: assignmentsList.filter(a => a.status === 'SUBMITTED').length,
    missing: assignmentsList.filter(a => a.status === 'MISSING').length,
    late: assignmentsList.filter(a => a.status === 'LATE').length,
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'submitted', 'missing', 'late'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">No {filterStatus} assignments</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const statusBadge = getStatusBadge(assignment.status);
            const daysUntilDue = getDaysUntilDue(assignment.due_date);
            const overdue = isOverdue(assignment.due_date, assignment.status);

            return (
              <div
                key={assignment.assignment_id}
                className={`p-4 rounded-lg border-l-4 transition-all ${
                  assignment.status === 'SUBMITTED'
                    ? 'border-green-500 bg-green-50'
                    : assignment.status === 'LATE'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 mb-2">{assignment.title}</h4>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(assignment.due_date)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <p className="font-medium text-gray-900">{assignment.status}</p>
                      </div>
                    </div>

                    {/* Submission Info */}
                    {assignment.submitted_at && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="text-gray-500">Submitted:</span>
                        <p className="font-medium text-gray-900">
                          {new Date(assignment.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Days Until Due / Overdue */}
                    {assignment.status !== 'SUBMITTED' && (
                      <div className="text-sm">
                        {overdue ? (
                          <p className="text-red-600 font-semibold">
                            ⚠️ Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}
                          </p>
                        ) : daysUntilDue === 0 ? (
                          <p className="text-orange-600 font-semibold">📅 Due Today</p>
                        ) : daysUntilDue < 0 ? (
                          <p className="text-red-600 font-semibold">
                            ⚠️ Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}
                          </p>
                        ) : (
                          <p className="text-blue-600 font-semibold">
                            ⏱️ {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} remaining
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="ml-4 flex flex-col gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      {statusBadge.icon} {statusBadge.label}
                    </span>
                    {assignment.status !== 'SUBMITTED' && (
                      <button
                        onClick={() => setUploadingAssignmentId(assignment.assignment_id)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        📤 Upload
                      </button>
                    )}
                    {assignment.status === 'SUBMITTED' && submissions[assignment.assignment_id] && (
                      <a
                        href={submissions[assignment.assignment_id].file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors whitespace-nowrap text-center"
                      >
                        📥 View File
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Submitted</p>
            <p className="text-lg font-bold text-green-600">{statusCounts.submitted}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Missing</p>
            <p className="text-lg font-bold text-red-600">{statusCounts.missing}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Late</p>
            <p className="text-lg font-bold text-orange-600">{statusCounts.late}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

AssignmentList.propTypes = {
  assignments: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        assignment_id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        due_date: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        submitted_at: PropTypes.string,
        is_overdue: PropTypes.bool,
      })
    ),
    PropTypes.shape({
      total: PropTypes.number,
      completed: PropTypes.number,
      completionRate: PropTypes.number,
      upcoming: PropTypes.array,
    }),
  ]),
  courseId: PropTypes.string,
};

export default AssignmentList;
