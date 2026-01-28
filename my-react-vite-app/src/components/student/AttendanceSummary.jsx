import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import studentService from '../../services/student.service';

const AttendanceSummary = ({ attendance = {}, courseId = null }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Fetch attendance for specific course if courseId provided
  useEffect(() => {
    if (courseId) {
      fetchCourseAttendance();
    } else if (attendance && Object.keys(attendance).length > 0) {
      setAttendanceData(attendance);
    }
  }, [courseId, attendance]);

  const fetchCourseAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await studentService.getCourseAttendance(courseId);
      if (response.status === 'success' && response.data) {
        setAttendanceData(response.data);
      }
    } catch (err) {
      setError('Failed to load attendance data');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get attendance status color
  const getStatusColor = (rate) => {
    if (rate >= 90) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Excellent' };
    if (rate >= 75) return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Good' };
    if (rate >= 60) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Fair' };
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'At Risk' };
  };

  // Get attendance status icon
  const getStatusIcon = (rate) => {
    if (rate >= 90) return '✓';
    if (rate >= 75) return '→';
    if (rate >= 60) return '⚠️';
    return '✗';
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  if (!attendanceData) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
        <span className="text-3xl mb-2 block">📊</span>
        <p className="text-gray-600">No attendance data available.</p>
      </div>
    );
  }

  const { totalClasses = 0, attendedClasses = 0, attendanceRate = 100, records = [] } = attendanceData;
  const statusColor = getStatusColor(attendanceRate);
  const statusIcon = getStatusIcon(attendanceRate);

  return (
    <div className="space-y-4">
      {/* Main Attendance Card */}
      <div className={`rounded-lg p-6 text-white ${statusColor.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Attendance Rate</p>
            <h3 className="text-4xl font-bold">{attendanceRate}%</h3>
          </div>
          <span className="text-5xl">{statusIcon}</span>
        </div>
        <p className="text-sm opacity-90">
          {attendedClasses} out of {totalClasses} classes attended
        </p>
      </div>

      {/* Status Label */}
      <div className={`p-3 rounded-lg text-center font-semibold ${statusColor.text}`}>
        Status: {statusColor.label}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Total Classes</p>
          <p className="text-2xl font-bold text-blue-600">{totalClasses}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Attended</p>
          <p className="text-2xl font-bold text-green-600">{attendedClasses}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Missed</p>
          <p className="text-2xl font-bold text-red-600">{totalClasses - attendedClasses}</p>
        </div>
      </div>

      {/* Attendance Records */}
      {records && records.length > 0 && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-semibold text-gray-900"
          >
            <span>📋 Attendance Records ({records.length})</span>
            <span>{showDetails ? '▼' : '▶'}</span>
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {records.map((record, index) => {
                const recordDate = new Date(record.attendance_date);
                const isPresent = record.is_present;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 flex items-center justify-between ${
                      isPresent
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {isPresent ? '✓' : '✗'}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {recordDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        {record.remarks && (
                          <p className="text-sm text-gray-600">{record.remarks}</p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        isPresent
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {isPresent ? 'Present' : 'Absent'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Recommendations</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          {attendanceRate >= 90 ? (
            <>
              <li>✓ Great attendance! Keep up the good work.</li>
              <li>✓ Your consistent attendance supports your academic success.</li>
            </>
          ) : attendanceRate >= 75 ? (
            <>
              <li>→ Your attendance is good, but try to improve further.</li>
              <li>→ Aim for 90%+ attendance to maximize learning.</li>
            </>
          ) : attendanceRate >= 60 ? (
            <>
              <li>⚠️ Your attendance needs improvement.</li>
              <li>⚠️ Missing classes can impact your grades and understanding.</li>
              <li>⚠️ Try to attend all upcoming classes.</li>
            </>
          ) : (
            <>
              <li>✗ Your attendance is critically low.</li>
              <li>✗ Please contact your advisor for support.</li>
              <li>✗ Regular attendance is essential for academic success.</li>
            </>
          )}
        </ul>
      </div>

      {/* Attendance Trend */}
      {records && records.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">📈 Recent Trend</h4>
          <div className="flex gap-1">
            {records.slice(0, 10).reverse().map((record, index) => (
              <div
                key={index}
                className={`flex-1 h-8 rounded-sm ${
                  record.is_present ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={`${new Date(record.attendance_date).toLocaleDateString()}: ${
                  record.is_present ? 'Present' : 'Absent'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Last 10 classes (left to right: oldest to newest)
          </p>
        </div>
      )}
    </div>
  );
};

AttendanceSummary.propTypes = {
  attendance: PropTypes.shape({
    totalClasses: PropTypes.number,
    attendedClasses: PropTypes.number,
    attendanceRate: PropTypes.number,
    records: PropTypes.arrayOf(
      PropTypes.shape({
        attendance_id: PropTypes.string,
        attendance_date: PropTypes.string.isRequired,
        is_present: PropTypes.bool.isRequired,
        remarks: PropTypes.string,
        created_at: PropTypes.string,
      })
    ),
  }),
  courseId: PropTypes.string,
};

export default AttendanceSummary;
