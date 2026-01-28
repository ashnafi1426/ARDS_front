import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import AssignmentList from './AssignmentList';
import AttendanceSummary from './AttendanceSummary';

const CourseList = ({ courses = [] }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle course selection
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setExpandedCourseId(course.courseId);
  };

  // Toggle course expansion
  const toggleCourseExpansion = (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(courseId);
    }
  };

  // Get risk status color
  const getRiskStatusColor = (isAtRisk) => {
    return isAtRisk ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50';
  };

  // Get risk badge
  const getRiskBadge = (isAtRisk) => {
    if (isAtRisk) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
          ⚠️ At Risk
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
        ✓ On Track
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <span className="text-4xl mb-4 block">📚</span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
        <p className="text-gray-600">You are not enrolled in any courses this semester.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 My Courses</h2>
        <p className="text-gray-600">
          You are enrolled in {courses.length} course{courses.length !== 1 ? 's' : ''} this semester
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className={`border-l-4 rounded-lg shadow-sm transition-all ${getRiskStatusColor(course.isAtRisk)}`}
          >
            {/* Course Header - Clickable */}
            <div
              onClick={() => toggleCourseExpansion(course.courseId)}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{course.courseCode}</h3>
                    {getRiskBadge(course.isAtRisk)}
                  </div>
                  <p className="text-gray-600 mb-3">{course.courseName}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Attendance Quick View */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Attendance:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className={`h-2 rounded-full ${
                            course.attendance.attendanceRate >= 90
                              ? 'bg-green-500'
                              : course.attendance.attendanceRate >= 75
                              ? 'bg-yellow-500'
                              : course.attendance.attendanceRate >= 60
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${course.attendance.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 min-w-fit">
                        {course.attendance.attendanceRate}%
                      </span>
                    </div>

                    {/* Assignments Quick View */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Assignments:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className={`h-2 rounded-full ${
                            course.assignments.completionRate >= 90
                              ? 'bg-green-500'
                              : course.assignments.completionRate >= 75
                              ? 'bg-yellow-500'
                              : course.assignments.completionRate >= 60
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${course.assignments.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 min-w-fit">
                        {course.assignments.completionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expand/Collapse Icon */}
                <div className="ml-4 text-2xl">
                  {expandedCourseId === course.courseId ? '▼' : '▶'}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCourseId === course.courseId && (
              <div className="border-t border-gray-200 p-4 bg-white bg-opacity-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Attendance Summary */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📊 Attendance</h4>
                    <AttendanceSummary attendance={course.attendance} />
                  </div>

                  {/* Assignments List */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📝 Assignments</h4>
                    <AssignmentList
                      assignments={course.assignments}
                      courseId={course.courseId}
                    />
                  </div>
                </div>

                {/* Upcoming Assignments Section */}
                {course.assignments.upcoming && course.assignments.upcoming.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">📅 Upcoming Assignments</h4>
                    <div className="space-y-2">
                      {course.assignments.upcoming.map((assignment, index) => {
                        const dueDate = new Date(assignment.dueDate);
                        const today = new Date();
                        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">{assignment.title}</p>
                              <p className="text-sm text-gray-600">
                                Due: {dueDate.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              {daysUntilDue < 0 ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                                  Overdue
                                </span>
                              ) : daysUntilDue === 0 ? (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                                  Today
                                </span>
                              ) : daysUntilDue <= 3 ? (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                                  {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                  {daysUntilDue} days left
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Courses */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>

        {/* Average Attendance */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✓</span>
            <div>
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  courses.reduce((sum, c) => sum + c.attendance.attendanceRate, 0) / courses.length
                )}%
              </p>
            </div>
          </div>
        </div>

        {/* Average Assignment Completion */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <p className="text-sm text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  courses.reduce((sum, c) => sum + c.assignments.completionRate, 0) / courses.length
                )}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CourseList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      courseId: PropTypes.string.isRequired,
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
        upcoming: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            dueDate: PropTypes.string.isRequired,
          })
        ),
      }).isRequired,
      isAtRisk: PropTypes.bool.isRequired,
    })
  ),
};

export default CourseList;
