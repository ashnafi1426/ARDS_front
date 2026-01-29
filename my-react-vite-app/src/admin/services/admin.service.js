import api from '../../config/api';

/**
 * Admin Service - Handles all admin-related API calls
 */

// ============ USER MANAGEMENT ============

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const resetUserPassword = async (userId) => {
  try {
    const response = await api.put(`/admin/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const getUserActivityLogs = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/activity-logs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

export const bulkDeleteUsers = async (userIds) => {
  try {
    const response = await api.post('/admin/users/bulk-delete', { userIds });
    return response.data;
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    throw error;
  }
};

export const bulkUpdateRole = async (userIds, role) => {
  try {
    const response = await api.post('/admin/users/bulk-update-role', { userIds, role });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating user roles:', error);
    throw error;
  }
};

// ============ STUDENT MANAGEMENT ============

export const getAllStudents = async () => {
  try {
    const response = await api.get('/admin/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const response = await api.get(`/admin/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await api.put(`/admin/students/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deactivateStudent = async (studentId) => {
  try {
    const response = await api.put(`/admin/students/${studentId}/deactivate`, {});
    return response.data;
  } catch (error) {
    console.error('Error deactivating student:', error);
    throw error;
  }
};

export const getStudentRiskHistory = async (studentId) => {
  try {
    const response = await api.get(`/admin/students/${studentId}/risk-history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student risk history:', error);
    throw error;
  }
};

// ============ ADVISOR MANAGEMENT ============

export const getAllAdvisors = async () => {
  try {
    const response = await api.get('/admin/advisors');
    return response.data;
  } catch (error) {
    console.error('Error fetching advisors:', error);
    throw error;
  }
};

export const createAdvisor = async (advisorData) => {
  try {
    const response = await api.post('/admin/advisors', advisorData);
    return response.data;
  } catch (error) {
    console.error('Error creating advisor:', error);
    throw error;
  }
};

export const updateAdvisor = async (advisorId, advisorData) => {
  try {
    const response = await api.put(`/admin/advisors/${advisorId}`, advisorData);
    return response.data;
  } catch (error) {
    console.error('Error updating advisor:', error);
    throw error;
  }
};

export const deleteAdvisor = async (advisorId) => {
  try {
    const response = await api.delete(`/admin/advisors/${advisorId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting advisor:', error);
    throw error;
  }
};

export const assignStudentsToAdvisor = async (advisorId, studentIds) => {
  try {
    const response = await api.post(`/admin/advisors/${advisorId}/assign-students`, {
      studentIds
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning students:', error);
    throw error;
  }
};

export const getAdvisorWorkload = async (advisorId) => {
  try {
    const response = await api.get(`/admin/advisors/${advisorId}/workload`);
    return response.data;
  } catch (error) {
    console.error('Error fetching advisor workload:', error);
    throw error;
  }
};

// ============ COURSE MANAGEMENT ============

export const getAllCourses = async () => {
  try {
    const response = await api.get('/admin/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/admin/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await api.put(`/admin/courses/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(`/admin/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// ============ SEMESTER MANAGEMENT ============

export const getAllSemesters = async () => {
  try {
    const response = await api.get('/admin/semesters');
    return response.data;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};

export const createSemester = async (semesterData) => {
  try {
    const response = await api.post('/admin/semesters', semesterData);
    return response.data;
  } catch (error) {
    console.error('Error creating semester:', error);
    throw error;
  }
};

export const updateSemester = async (semesterId, semesterData) => {
  try {
    const response = await api.put(`/admin/semesters/${semesterId}`, semesterData);
    return response.data;
  } catch (error) {
    console.error('Error updating semester:', error);
    throw error;
  }
};

export const deleteSemester = async (semesterId) => {
  try {
    const response = await api.delete(`/admin/semesters/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting semester:', error);
    throw error;
  }
};

// ============ REPORTS & ANALYTICS ============

export const getSystemOverview = async () => {
  try {
    const response = await api.get('/admin/reports/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching system overview:', error);
    throw error;
  }
};

export const getRiskDistribution = async () => {
  try {
    const response = await api.get('/admin/reports/risk-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching risk distribution:', error);
    throw error;
  }
};

export const generateReport = async (reportType, filters = {}) => {
  try {
    const response = await api.post('/admin/reports/generate', {
      type: reportType,
      ...filters
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const getAllReports = async () => {
  try {
    const response = await api.get('/admin/reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const downloadReport = async (reportId) => {
  try {
    const response = await api.get(`/admin/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};

// ============ SYSTEM MONITORING ============

export const getSystemStatus = async () => {
  try {
    const response = await api.get('/admin/system/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
};

export const getSystemMetrics = async () => {
  try {
    const response = await api.get('/admin/system/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    throw error;
  }
};

export const getSystemLogs = async (limit = 50) => {
  try {
    const response = await api.get(`/admin/system/logs?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system logs:', error);
    throw error;
  }
};

// ============ NOTIFICATIONS & ALERTS ============

export const getAllNotifications = async () => {
  try {
    const response = await api.get('/admin/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const sendNotification = async (notificationData) => {
  try {
    const response = await api.post('/admin/notifications/send', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/admin/notifications/${notificationId}/read`, {});
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/admin/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// ============ SETTINGS & CONFIGURATION ============

export const getSettings = async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await api.put('/admin/settings', settingsData);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const updateRiskWeights = async (weights) => {
  try {
    const response = await api.put('/admin/config/risk-weights', weights);
    return response.data;
  } catch (error) {
    console.error('Error updating risk weights:', error);
    throw error;
  }
};

// ============ SECURITY & COMPLIANCE ============

export const getRBACConfig = async () => {
  try {
    const response = await api.get('/admin/security/rbac');
    return response.data;
  } catch (error) {
    console.error('Error fetching RBAC config:', error);
    throw error;
  }
};

export const updateRBACConfig = async (rbacData) => {
  try {
    const response = await api.put('/admin/security/rbac', rbacData);
    return response.data;
  } catch (error) {
    console.error('Error updating RBAC config:', error);
    throw error;
  }
};

export const getAuditLogs = async (limit = 100) => {
  try {
    const response = await api.get(`/admin/security/audit-logs?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

export const getSecuritySettings = async () => {
  try {
    const response = await api.get('/admin/security/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    throw error;
  }
};

export const updateSecuritySettings = async (securityData) => {
  try {
    const response = await api.put('/admin/security/settings', securityData);
    return response.data;
  } catch (error) {
    console.error('Error updating security settings:', error);
    throw error;
  }
};

// ============ MAINTENANCE & SUPPORT ============

export const getDatabaseHealth = async () => {
  try {
    const response = await api.get('/admin/maintenance/database-health');
    return response.data;
  } catch (error) {
    console.error('Error fetching database health:', error);
    throw error;
  }
};

export const getBackupStatus = async () => {
  try {
    const response = await api.get('/admin/maintenance/backup-status');
    return response.data;
  } catch (error) {
    console.error('Error fetching backup status:', error);
    throw error;
  }
};

export const triggerBackup = async () => {
  try {
    const response = await api.post('/admin/maintenance/backup', {});
    return response.data;
  } catch (error) {
    console.error('Error triggering backup:', error);
    throw error;
  }
};

export const getMaintenanceSchedule = async () => {
  try {
    const response = await api.get('/admin/maintenance/schedule');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance schedule:', error);
    throw error;
  }
};

export const updateMaintenanceSchedule = async (scheduleData) => {
  try {
    const response = await api.put('/admin/maintenance/schedule', scheduleData);
    return response.data;
  } catch (error) {
    console.error('Error updating maintenance schedule:', error);
    throw error;
  }
};

// ============ ASSIGNMENTS & ATTENDANCE ============

export const createAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/admin/assignments', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

export const createAttendanceRecords = async (attendanceData) => {
  try {
    const response = await api.post('/admin/attendance', attendanceData);
    return response.data;
  } catch (error) {
    console.error('Error creating attendance records:', error);
    throw error;
  }
};

// ============ DASHBOARD STATISTICS ============

export const getDashboardStats = async () => {
  try {
    const [overview, riskDist] = await Promise.all([
      getSystemOverview(),
      getRiskDistribution()
    ]);
    return {
      overview: overview.data,
      riskDistribution: riskDist.data
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export default {
  // Users
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getUserActivityLogs,
  toggleUserStatus,
  bulkDeleteUsers,
  bulkUpdateRole,
  
  // Students
  getAllStudents,
  getStudentById,
  updateStudent,
  deactivateStudent,
  getStudentRiskHistory,
  
  // Advisors
  getAllAdvisors,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor,
  assignStudentsToAdvisor,
  getAdvisorWorkload,
  
  // Courses
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Semesters
  getAllSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  
  // Reports
  getSystemOverview,
  getRiskDistribution,
  generateReport,
  getAllReports,
  downloadReport,
  
  // System
  getSystemStatus,
  getSystemMetrics,
  getSystemLogs,
  
  // Notifications
  getAllNotifications,
  sendNotification,
  markNotificationAsRead,
  deleteNotification,
  
  // Settings
  getSettings,
  updateSettings,
  updateRiskWeights,
  
  // Security
  getRBACConfig,
  updateRBACConfig,
  getAuditLogs,
  getSecuritySettings,
  updateSecuritySettings,
  
  // Maintenance
  getDatabaseHealth,
  getBackupStatus,
  triggerBackup,
  getMaintenanceSchedule,
  updateMaintenanceSchedule,
  
  // Assignments & Attendance
  createAssignment,
  createAttendanceRecords,
  
  // Dashboard
  getDashboardStats
};
