import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import studentService from '../services/student.service';
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CourseList from '../components/student/CourseList';

const StudentCoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [filterSemester, setFilterSemester] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // name, attendance, assignments, risk

  // Fetch dashboard data which includes course breakdown
  useEffect(() => {
    fetchCoursesData();
  }, []);

  const fetchCoursesData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔄 Fetching courses data...');
      
      // Fetch dashboard summary which includes courseBreakdown
      const summaryRes = await studentService.getDashboardSummary();
      
      if (summaryRes.status === 'success' && summaryRes.data) {
        const courseBreakdown = summaryRes.data.courseBreakdown || [];
        console.log('✅ Courses loaded:', courseBreakdown.length);
        
        // Sort courses based on selected sort option
        const sortedCourses = sortCourses(courseBreakdown, sortBy);
        setCourses(sortedCourses);
      } else {
        setError('Failed to load courses data');
      }
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sort courses based on selected option
  const sortCourses = (coursesToSort, sortOption) => {
    const sorted = [...coursesToSort];
    
    switch (sortOption) {
      case 'attendance':
        return sorted.sort((a, b) => a.attendance.attendanceRate - b.attendance.attendanceRate);
      case 'assignments':
        return sorted.sort((a, b) => a.assignments.completionRate - b.assignments.completionRate);
      case 'risk':
        return sorted.sort((a, b) => {
          if (a.isAtRisk === b.isAtRisk) return 0;
          return a.isAtRisk ? -1 : 1;
        });
      case 'name':
      default:
        return sorted.sort((a, b) => a.courseName.localeCompare(b.courseName));
    }
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    const sorted = sortCourses(courses, newSort);
    setCourses(sorted);
  };

  // Filter courses by semester
  const getFilteredCourses = () => {
    if (filterSemester === 'all') return courses;
    return courses.filter(c => c.semester === filterSemester);
  };

  // Get unique semesters
  const getSemesters = () => {
    const semesters = new Set(courses.map(c => c.semester));
    return Array.from(semesters).sort();
  };

  // Get statistics
  const getStatistics = () => {
    const filtered = getFilteredCourses();
    if (filtered.length === 0) {
      return {
        totalCourses: 0,
        avgAttendance: 0,
        avgCompletion: 0,
        atRiskCount: 0,
      };
    }

    const avgAttendance = Math.round(
      filtered.reduce((sum, c) => sum + c.attendance.attendanceRate, 0) / filtered.length
    );
    const avgCompletion = Math.round(
      filtered.reduce((sum, c) => sum + c.assignments.completionRate, 0) / filtered.length
    );
    const atRiskCount = filtered.filter(c => c.isAtRisk).length;

    return {
      totalCourses: filtered.length,
      avgAttendance,
      avgCompletion,
      atRiskCount,
    };
  };

  if (loading) return <LoadingSpinner />;

  const stats = getStatistics();
  const filteredCourses = getFilteredCourses();
  const semesters = getSemesters();

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📚 My Courses</h1>
              <p className="text-gray-600">View your enrolled courses and track progress</p>
            </div>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✓</span>
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgAttendance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCompletion}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="text-sm text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-red-600">{stats.atRiskCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Filter by Semester
              </label>
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Semesters</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Course Name</option>
                <option value="attendance">Attendance (Low to High)</option>
                <option value="assignments">Assignment Completion (Low to High)</option>
                <option value="risk">At-Risk Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length > 0 ? (
          <CourseList courses={filteredCourses} />
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <span className="text-4xl mb-4 block">📚</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-600">
              {filterSemester !== 'all'
                ? `No courses found for ${filterSemester}`
                : 'You are not enrolled in any courses this semester.'}
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">💡 How to Use This Page</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ Click on any course to expand and see detailed attendance and assignment information</li>
            <li>✓ Use the filters to view courses by semester</li>
            <li>✓ Sort courses to identify areas that need attention</li>
            <li>✓ Red-bordered courses indicate at-risk status (attendance or assignments below 75%)</li>
            <li>✓ Check upcoming assignments to stay on top of deadlines</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCoursesPage;
