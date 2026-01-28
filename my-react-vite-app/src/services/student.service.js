// Student Service - Frontend API Layer
// This service handles all student-related API calls to the backend
// Similar to Abe Garage service pattern

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ============================================
// STUDENT PROFILE SERVICES
// ============================================

/**
 * Get student profile
 * @returns {Promise} Student profile data
 */
export const getStudentProfile = async () => {
  try {
    console.log('📊 Fetching student profile from:', `${API_URL}/students/profile`);
    
    const response = await fetch(`${API_URL}/students/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch profile';
      console.error('❌ Get profile failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Profile fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get profile error:', error.message);
    throw error;
  }
};

/**
 * Update student profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile data
 */
export const updateStudentProfile = async (profileData) => {
  try {
    console.log('📝 Updating student profile');
    
    const response = await fetch(`${API_URL}/students/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to update profile';
      console.error('❌ Update profile failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Profile updated successfully');
    return data;
  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    throw error;
  }
};

// ============================================
// SELF-CHECK SERVICES
// ============================================

/**
 * Submit weekly self-check
 * @param {Object} selfCheckData - Self-check form data
 * @returns {Promise} Submission result
 */
export const submitSelfCheck = async (selfCheckData) => {
  try {
    console.log('📝 Submitting self-check');
    console.log('📦 Self-check data being sent:', JSON.stringify(selfCheckData, null, 2));
    
    const response = await fetch(`${API_URL}/students/self-check`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(selfCheckData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to submit self-check';
      console.error('❌ Submit self-check failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Self-check submitted successfully');
    console.log('📊 Response data:', data);
    return data;
  } catch (error) {
    console.error('❌ Submit self-check error:', error.message);
    throw error;
  }
};

// ============================================
// NOTIFICATION SERVICES
// ============================================

/**
 * Get student notifications
 * @returns {Promise} List of notifications
 */
export const getStudentNotifications = async () => {
  try {
    console.log('🔔 Fetching student notifications');
    
    const response = await fetch(`${API_URL}/students/notifications`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch notifications';
      console.error('❌ Get notifications failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Notifications fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get notifications error:', error.message);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Update result
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    console.log('✓ Marking notification as read:', notificationId);
    
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to mark notification as read';
      console.error('❌ Mark as read failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Notification marked as read');
    return data;
  } catch (error) {
    console.error('❌ Mark as read error:', error.message);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise} Update result
 */
export const markAllNotificationsAsRead = async () => {
  try {
    console.log('✓ Marking all notifications as read');
    
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to mark all notifications as read';
      console.error('❌ Mark all as read failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ All notifications marked as read');
    return data;
  } catch (error) {
    console.error('❌ Mark all as read error:', error.message);
    throw error;
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Delete result
 */
export const deleteNotification = async (notificationId) => {
  try {
    console.log('🗑️ Deleting notification:', notificationId);
    
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to delete notification';
      console.error('❌ Delete notification failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Notification deleted');
    return data;
  } catch (error) {
    console.error('❌ Delete notification error:', error.message);
    throw error;
  }
};

// ============================================
// RISK HISTORY SERVICES
// ============================================

/**
 * Get student risk history
 * @returns {Promise} Risk history data
 */
export const getStudentRiskHistory = async () => {
  try {
    console.log('📈 Fetching risk history');
    
    const response = await fetch(`${API_URL}/students/risk-history`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch risk history';
      console.error('❌ Get risk history failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Risk history fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get risk history error:', error.message);
    throw error;
  }
};

// ============================================
// COURSE SERVICES
// ============================================

/**
 * Get student courses
 * @returns {Promise} List of courses
 */
export const getStudentCourses = async () => {
  try {
    console.log('📚 Fetching student courses');
    
    const response = await fetch(`${API_URL}/students/courses`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch courses';
      console.error('❌ Get courses failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Courses fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get courses error:', error.message);
    throw error;
  }
};

// ============================================
// ASSIGNMENT SERVICES
// ============================================

/**
 * Get student assignments
 * @returns {Promise} List of assignments
 */
export const getStudentAssignments = async () => {
  try {
    console.log('📝 Fetching student assignments');
    
    const response = await fetch(`${API_URL}/students/assignments`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch assignments';
      console.error('❌ Get assignments failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Assignments fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get assignments error:', error.message);
    throw error;
  }
};

/**
 * Get dashboard summary with all stats
 * @returns {Promise} Complete dashboard data
 */
export const getDashboardSummary = async () => {
  try {
    console.log('📊 Fetching dashboard summary');
    
    const response = await fetch(`${API_URL}/students/dashboard-summary`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch dashboard summary';
      console.error('❌ Get dashboard summary failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Dashboard summary fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get dashboard summary error:', error.message);
    throw error;
  }
};

// ============================================
// PER-COURSE SERVICES
// ============================================

/**
 * Get attendance for a specific course
 * @param {string} courseId - Course ID
 * @returns {Promise} Attendance data for the course
 */
export const getCourseAttendance = async (courseId) => {
  try {
    console.log('📊 Fetching attendance for course:', courseId);
    
    const response = await fetch(`${API_URL}/students/attendance/${courseId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch course attendance';
      console.error('❌ Get course attendance failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Course attendance fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get course attendance error:', error.message);
    throw error;
  }
};

/**
 * Get assignments for a specific course
 * @param {string} courseId - Course ID
 * @returns {Promise} Assignments data for the course
 */
export const getCourseAssignments = async (courseId) => {
  try {
    console.log('📝 Fetching assignments for course:', courseId);
    
    const response = await fetch(`${API_URL}/students/courses/${courseId}/assignments`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Failed to fetch course assignments';
      console.error('❌ Get course assignments failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Course assignments fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get course assignments error:', error.message);
    throw error;
  }
};

// ============================================
// EXPORT ALL SERVICES
// ============================================

const studentService = {
  // Profile
  getStudentProfile,
  updateStudentProfile,
  
  // Self-Check
  submitSelfCheck,
  
  // Notifications
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  
  // Risk History
  getStudentRiskHistory,
  
  // Courses
  getStudentCourses,
  
  // Assignments
  getStudentAssignments,
  
  // Dashboard Summary
  getDashboardSummary,
  
  // Per-Course Services
  getCourseAttendance,
  getCourseAssignments,
};

export default studentService;
