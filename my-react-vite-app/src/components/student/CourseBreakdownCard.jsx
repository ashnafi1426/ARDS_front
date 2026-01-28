import PropTypes from 'prop-types';

const CourseBreakdownCard = ({ course }) => {
  const { 
    courseCode, 
    courseName, 
    attendance, 
    assignments, 
    isAtRisk 
  } = course;

  const getStatusColor = (rate) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    if (rate >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusText = (rate) => {
    if (rate >= 90) return 'Excellent';
    if (rate >= 75) return 'Good';
    if (rate >= 60) return 'Fair';
    return 'At Risk';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${isAtRisk ? 'border-red-500' : 'border-green-500'}`}>
      {/* Course Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{courseCode}</h3>
          <p className="text-sm text-gray-600">{courseName}</p>
        </div>
        {isAtRisk && (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            At Risk
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Attendance */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Attendance</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getStatusColor(attendance.attendanceRate)}`}
                style={{ width: `${attendance.attendanceRate}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-900">{attendance.attendanceRate}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {attendance.attendedClasses} / {attendance.totalClasses} classes
          </p>
          <p className="text-xs font-semibold mt-1" style={{ color: getStatusColor(attendance.attendanceRate).replace('bg-', '#') }}>
            {getStatusText(attendance.attendanceRate)}
          </p>
        </div>

        {/* Assignments */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Assignments</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getStatusColor(assignments.completionRate)}`}
                style={{ width: `${assignments.completionRate}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-900">{assignments.completionRate}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {assignments.completed} / {assignments.total} completed
          </p>
          <p className="text-xs font-semibold mt-1" style={{ color: getStatusColor(assignments.completionRate).replace('bg-', '#') }}>
            {getStatusText(assignments.completionRate)}
          </p>
        </div>
      </div>

      {/* Upcoming Assignments */}
      {assignments.upcoming && assignments.upcoming.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Upcoming Assignments</p>
          <ul className="space-y-1">
            {assignments.upcoming.map((assignment, index) => (
              <li key={index} className="text-sm text-gray-700 flex justify-between">
                <span>{assignment.title}</span>
                <span className="text-xs text-gray-500">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

CourseBreakdownCard.propTypes = {
  course: PropTypes.shape({
    courseCode: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
    attendance: PropTypes.shape({
      totalClasses: PropTypes.number.isRequired,
      attendedClasses: PropTypes.number.isRequired,
      attendanceRate: PropTypes.number.isRequired,
    }).isRequired,
    assignments: PropTypes.shape({
      total: PropTypes.number.isRequired,
      completed: PropTypes.number.isRequired,
      completionRate: PropTypes.number.isRequired,
      upcoming: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        dueDate: PropTypes.string.isRequired,
      })),
    }).isRequired,
    isAtRisk: PropTypes.bool.isRequired,
  }).isRequired,
};

export default CourseBreakdownCard;
