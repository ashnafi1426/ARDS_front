import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import studentService from '../services/student.service';
import DashboardLayout from '../components/layouts/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import CourseBreakdownCard from '../components/student/CourseBreakdownCard';

const StudentDashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for dynamic data
  const [studentData, setStudentData] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [riskHistory, setRiskHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    
    // Listen for self-check submissions
    const handleSelfCheckSubmitted = () => {
      console.log('📊 Self-check submitted, refreshing dashboard...');
      fetchDashboardData();
    };
    
    window.addEventListener('selfCheckSubmitted', handleSelfCheckSubmitted);
    
    return () => {
      window.removeEventListener('selfCheckSubmitted', handleSelfCheckSubmitted);
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔄 Fetching dashboard data...');
      
      // Parallel fetch: Dashboard summary + Risk history + Notifications
      // These are the only 3 essential calls needed
      const [summaryRes, riskRes, notifRes] = await Promise.allSettled([
        studentService.getDashboardSummary(),
        studentService.getStudentRiskHistory(),
        studentService.getStudentNotifications()
      ]);

      // Process dashboard summary
      if (summaryRes.status === 'fulfilled' && summaryRes.value?.status === 'success' && summaryRes.value?.data) {
        console.log('✅ Dashboard summary loaded');
        setDashboardSummary(summaryRes.value.data);
        setStudentData(summaryRes.value.data.student);
        // Assignments and courses are already in the summary
        setAssignments(summaryRes.value.data.assignments?.upcoming || []);
        setCourses(summaryRes.value.data.courseBreakdown || []);
      } else {
        console.error('❌ Dashboard summary failed:', summaryRes.reason?.message);
      }

      // Process risk history
      if (riskRes.status === 'fulfilled' && riskRes.value?.status === 'success' && riskRes.value?.data) {
        console.log('✅ Risk history loaded');
        setRiskHistory(Array.isArray(riskRes.value.data) ? riskRes.value.data : []);
      } else {
        console.log('ℹ️ Risk history not available');
      }

      // Process notifications
      if (notifRes.status === 'fulfilled' && notifRes.value?.status === 'success' && notifRes.value?.data) {
        console.log('✅ Notifications loaded');
        setNotifications(notifRes.value.data.notifications || []);
      } else {
        console.log('ℹ️ Notifications not available');
      }

      console.log('✅ Dashboard data fetch complete');
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Mock calendar events
  const calendarEvents = [
    { id: 1, title: 'Study Group Session', date: 'Sunday, January 25', time: 'Jan 23, 05:27', icon: '📚', color: 'blue' },
    { id: 2, title: 'Assignment Due: Math 101', date: 'Monday, January 26', time: 'in 3 days', icon: '📝', color: 'pink' },
    { id: 3, title: 'Midterm Exams', date: 'Wednesday, January 25', time: 'Jan 30', icon: '📄', color: 'red' },
    { id: 4, title: 'Project Presentation', date: 'Friday, January 20', time: 'Feb 2', icon: '📊', color: 'purple' },
    { id: 5, title: 'Advisor Meeting', date: 'Monday, February 2', time: 'Feb 2', icon: '👨‍🏫', color: 'green' }
  ];

  // Calculate GPA trend data from risk history
  const getGPATrendData = () => {
    if (riskHistory.length === 0) {
      // Show current GPA if no history
      const currentGPA = parseFloat(studentData?.gpa) || 0;
      return [
        { week: 'Current', value: currentGPA, status: currentGPA >= 3.5 ? 'good' : currentGPA >= 2.5 ? 'warning' : 'bad' }
      ];
    }
    
    // Use last 6 entries from risk history
    return riskHistory.slice(0, 6).reverse().map((item, index) => {
      const gpa = parseFloat(studentData?.gpa) || 0; // Use current GPA as history doesn't store GPA
      return {
        week: `Week ${index + 1}`,
        value: gpa,
        status: gpa >= 3.5 ? 'good' : gpa >= 2.5 ? 'warning' : 'bad',
        date: new Date(item.calculated_at).toLocaleDateString()
      };
    });
  };

  // Calculate attendance trend data from real attendance records
  const getAttendanceTrendData = () => {
    if (!dashboardSummary?.attendance?.recentAttendance || dashboardSummary.attendance.recentAttendance.length === 0) {
      // Show current rate if no history
      const currentRate = getAttendanceRate();
      return [
        { week: 'Current', value: currentRate, status: currentRate >= 90 ? 'good' : currentRate >= 60 ? 'warning' : 'bad' }
      ];
    }
    
    // Group attendance by week and calculate weekly rates
    const recentRecords = dashboardSummary.attendance.recentAttendance;
    const weeklyData = [];
    
    // Take last 4 weeks of data
    for (let i = 0; i < Math.min(4, Math.ceil(recentRecords.length / 5)); i++) {
      const weekRecords = recentRecords.slice(i * 5, (i + 1) * 5);
      const presentCount = weekRecords.filter(r => r.present).length;
      const weekRate = weekRecords.length > 0 ? Math.round((presentCount / weekRecords.length) * 100) : 100;
      
      weeklyData.push({
        week: `Week ${i + 1}`,
        value: weekRate,
        status: weekRate >= 90 ? 'good' : weekRate >= 60 ? 'warning' : 'bad',
        records: weekRecords.length
      });
    }
    
    return weeklyData.reverse(); // Show oldest to newest
  };

  // Get risk level color and label
  const getRiskInfo = () => {
    const riskLevel = studentData?.risk_level?.toUpperCase() || 'LOW';
    
    const riskConfig = {
      'LOW': { color: 'bg-green-500', label: 'Low Risk', icon: '✓' },
      'MEDIUM': { color: 'bg-yellow-500', label: 'Medium Risk', icon: '⚠️' },
      'HIGH': { color: 'bg-orange-500', label: 'High Risk', icon: '⚠️' },
      'CRITICAL': { color: 'bg-red-500', label: 'Critical Risk', icon: '🚨' }
    };
    
    return riskConfig[riskLevel] || riskConfig['LOW'];
  };

  // Get last assessment date
  const getLastAssessment = () => {
    if (riskHistory.length === 0) return 'Never';
    const lastEntry = riskHistory[0];
    return new Date(lastEntry.calculated_at).toLocaleString();
  };

  // Get attendance rate from dashboard summary
  const getAttendanceRate = () => {
    return dashboardSummary?.attendance?.attendanceRate || 100;
  };

  // Get attendance stats
  const getAttendanceStats = () => {
    if (!dashboardSummary?.attendance) {
      return { total: 0, attended: 0, rate: 100 };
    }
    return {
      total: dashboardSummary.attendance.totalClasses,
      attended: dashboardSummary.attendance.attendedClasses,
      rate: dashboardSummary.attendance.attendanceRate
    };
  };

  // Calculate assignment completion rate
  const getAssignmentStats = () => {
    if (!dashboardSummary?.assignments) {
      return { completed: 0, total: 0, rate: 100 };
    }
    return {
      completed: dashboardSummary.assignments.completed,
      total: dashboardSummary.assignments.total,
      rate: dashboardSummary.assignments.completionRate
    };
  };

  // Get course count
  const getCourseCount = () => {
    return dashboardSummary?.courses?.count || 0;
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const riskInfo = getRiskInfo();
  const assignmentStats = getAssignmentStats();
  const gpaValue = parseFloat(studentData?.gpa) || 0;
  const studentName = studentData?.full_name || user?.firstName || 'Student';

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {studentName}!</h1>
          <p className="text-gray-600">Here's your academic overview</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Risk Status Card - DYNAMIC */}
          <div className={`${riskInfo.color} text-white rounded-lg p-6 shadow-md`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{riskInfo.icon}</span>
              <div>
                <h3 className="font-bold text-xl">{riskInfo.label}</h3>
                <p className="text-sm opacity-90">Last Assessment: {getLastAssessment()}</p>
              </div>
            </div>
          </div>

          {/* GPA Card - DYNAMIC */}
          <div className="bg-blue-500 text-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="font-bold text-4xl">{gpaValue.toFixed(2)}</h3>
                <p className="text-sm opacity-90">Current GPA</p>
              </div>
            </div>
          </div>

          {/* Attendance Card - DYNAMIC FROM BACKEND */}
          <div className="bg-pink-500 text-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✓</span>
              <div>
                <h3 className="font-bold text-4xl">{getAttendanceRate()}%</h3>
                <p className="text-sm opacity-90">Attendance Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats - DYNAMIC */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-bold text-2xl text-gray-900">{gpaValue.toFixed(2)}</h4>
                <p className="text-sm text-gray-600">Current GPA</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-bold text-2xl text-gray-900">{getAttendanceRate()}%</h4>
                <p className="text-sm text-gray-600">Attendance Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <h4 className="font-bold text-2xl text-gray-900">{assignmentStats.completed}/{assignmentStats.total}</h4>
                <p className="text-sm text-gray-600">Assignments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-bold text-2xl text-gray-900">{studentData?.year_of_study || 'N/A'}</h4>
                <p className="text-sm text-gray-600">Current Year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => {
              setActiveTab('self-check');
              navigate('/student/self-check');
            }}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'self-check'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📝 Self-Check
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              navigate('/student/profile');
            }}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'account'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            💼 Account
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity / Quick Stats - DYNAMIC */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
                <button className="text-gray-400 hover:text-gray-600">⋯</button>
              </div>
              <div className="space-y-3">
                {riskHistory.length > 0 ? (
                  <>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📊</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">Risk Assessment Updated</h4>
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">
                              RECENT
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Your risk level is currently {studentData?.risk_level || 'LOW'}. 
                            Score: {studentData?.risk_score?.toFixed(0) || 0}/100
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(riskHistory[0].calculated_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {dashboardSummary?.attendance && (
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">✓</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Attendance Summary</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              You've attended {dashboardSummary.attendance.attendedClasses} out of {dashboardSummary.attendance.totalClasses} classes 
                              ({dashboardSummary.attendance.attendanceRate}% attendance rate)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {notifications.length > 0 && (
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🔔</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">New Notification</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notifications[0].message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notifications[0].created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-gray-50 text-center">
                    <span className="text-4xl mb-2 block">📊</span>
                    <p className="text-gray-600">No recent activity</p>
                    <p className="text-sm text-gray-500 mt-1">Submit a self-check to get started</p>
                  </div>
                )}
                
                {getCourseCount() > 0 && (
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📚</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Enrolled Courses</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          You are enrolled in {getCourseCount()} course{getCourseCount() !== 1 ? 's' : ''} this semester
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Per-Course Breakdown - NEW */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Course Performance</h3>
                <button
                  onClick={() => navigate('/student/courses')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Courses →
                </button>
              </div>
              {dashboardSummary?.courseBreakdown && dashboardSummary.courseBreakdown.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">{dashboardSummary.courseBreakdown.length} courses</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardSummary.courseBreakdown.map((course) => (
                      <CourseBreakdownCard key={course.courseId} course={course} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">📚</span>
                  <p className="text-gray-600">No courses available yet</p>
                  <p className="text-sm text-gray-500 mt-1">Click "View All Courses" to see your enrolled courses</p>
                </div>
              )}
            </div>

            {/* GPA Trend Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">GPA Trend</h3>
                <span className="text-sm text-gray-600">Last 6 months</span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {getGPATrendData().map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '100%' }}>
                      {data.value > 0 && (
                        <div
                          className={`absolute bottom-0 w-full rounded-t ${
                            data.status === 'good'
                              ? 'bg-green-500'
                              : data.status === 'warning'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                          style={{ height: `${(data.value / 4) * 100}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                            {data.value.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{data.week}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Good ({'>'}3.5)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Warning (2.5-3.5)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Low ({'<'}2.5)</span>
                </div>
              </div>
            </div>

            {/* Attendance Trend */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Attendance Trend</h3>
                <span className="text-sm text-gray-600">Last 6 months</span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {getAttendanceTrendData().map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '100%' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t ${
                          data.status === 'good'
                            ? 'bg-green-500'
                            : data.status === 'warning'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                        style={{ height: `${data.value}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                          {data.value}%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{data.week}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Good ({'>'}90%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Warning (60-79%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Low ({'<'}60%)</span>
                </div>
              </div>
            </div>

            {/* Academic Calendar */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Academic Calendar</h3>
                <button
                  onClick={() => navigate('/student/calendar')}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                >
                  📅 iElement &rarr;
                </button>
              </div>
              <div className="space-y-3">
                {calendarEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <span className="text-2xl">{event.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Actions and Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/student/profile')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xl">👥</span>
                  <span className="font-semibold text-gray-900">Manage Users</span>
                </button>
                <button
                  onClick={() => navigate('/student/profile')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xl">👤</span>
                  <span className="font-semibold text-gray-900">View Profile</span>
                </button>
                <button
                  onClick={() => navigate('/student/notifications')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xl">🔔</span>
                  <span className="font-semibold text-gray-900">All Notifications</span>
                </button>
                <button
                  onClick={() => navigate('/student/resources')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xl">📚</span>
                  <span className="font-semibold text-gray-900">Academic Resources</span>
                </button>
              </div>
            </div>

            {/* Notifications - DYNAMIC */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
                <button
                  onClick={() => navigate('/student/notifications')}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                >
                  View All &rarr;
                </button>
              </div>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.slice(0, 3).map((notif) => {
                    const priority = notif.priority?.toUpperCase() || 'LOW';
                    const borderColor = priority === 'HIGH' ? 'border-red-500' : 
                                       priority === 'MEDIUM' ? 'border-yellow-500' : 
                                       'border-green-500';
                    const bgColor = priority === 'HIGH' ? 'bg-red-50' : 
                                   priority === 'MEDIUM' ? 'bg-yellow-50' : 
                                   'bg-green-50';
                    
                    return (
                      <div
                        key={notif.notification_id}
                        className={`p-4 rounded-lg border-l-4 ${borderColor} ${bgColor}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">
                            {priority === 'HIGH' ? '🚨' : priority === 'MEDIUM' ? '⚠️' : '📝'}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">
                                {priority} Priority
                              </h4>
                              {!notif.is_read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notif.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-2 block">🔔</span>
                    <p className="text-sm text-gray-500">No notifications</p>
                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Events */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {calendarEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{event.icon}</span>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.date.split(',')[0]}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardNew;
