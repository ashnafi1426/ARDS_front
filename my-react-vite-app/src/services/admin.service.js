import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

// Create axios instance for admin operations
const adminClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Management Services
export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await adminClient.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      console.log('🔍 Admin Service - Creating user with data:', userData);
      console.log('🔍 API URL:', `${API_URL}/admin/users`);
      console.log('🔍 Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      const response = await adminClient.post('/admin/users', userData);
      console.log('✅ Admin Service - User created response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Admin Service - Error creating user:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await adminClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      console.log('🔍 Admin Service - Deleting user with ID:', userId);
      console.log('🔍 API URL:', `${API_URL}/admin/users/${userId}`);
      
      const response = await adminClient.delete(`/admin/users/${userId}`);
      console.log('✅ Admin Service - User deleted response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Admin Service - Error deleting user:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Reset user password
  resetPassword: async (userId) => {
    try {
      const response = await adminClient.put(`/admin/users/${userId}/reset-password`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },

  // Get user activity logs
  getUserActivityLogs: async (userId) => {
    try {
      const response = await adminClient.get(`/admin/users/${userId}/activity-logs`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  },

  // Toggle user status (activate/deactivate)
  toggleUserStatus: async (userId, status) => {
    try {
      const response = await adminClient.put(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  },

  // Bulk user operations
  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await adminClient.post('/admin/users/bulk-delete', { userIds });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete users');
    }
  },

  bulkUpdateRole: async (userIds, role) => {
    try {
      const response = await adminClient.post('/admin/users/bulk-update-role', { userIds, role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user roles');
    }
  }
};

// System Management Services
export const systemService = {
  // Get system overview
  getSystemOverview: async () => {
    try {
      const response = await adminClient.get('/admin/reports/overview');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system overview');
    }
  },

  // Get risk distribution
  getRiskDistribution: async () => {
    try {
      const response = await adminClient.get('/admin/reports/risk-distribution');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch risk distribution');
    }
  },

  // Update risk weights
  updateRiskWeights: async (weights) => {
    try {
      const response = await adminClient.put('/admin/config/risk-weights', weights);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update risk weights');
    }
  },

  // Get system health
  getSystemHealth: async () => {
    try {
      const response = await adminClient.get('/admin/system/health');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system health');
    }
  },

  // Get system logs
  getSystemLogs: async (filters = {}) => {
    try {
      const response = await adminClient.get('/admin/system/logs', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system logs');
    }
  }
};

// Assignment Management Services
export const assignmentService = {
  // Create assignment
  createAssignment: async (assignmentData) => {
    try {
      const response = await adminClient.post('/admin/assignments', assignmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create assignment');
    }
  },

  // Get assignments
  getAssignments: async (filters = {}) => {
    try {
      const response = await adminClient.get('/admin/assignments', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  },

  // Update assignment
  updateAssignment: async (assignmentId, assignmentData) => {
    try {
      const response = await adminClient.put(`/admin/assignments/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update assignment');
    }
  },

  // Delete assignment
  deleteAssignment: async (assignmentId) => {
    try {
      const response = await adminClient.delete(`/admin/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete assignment');
    }
  }
};

// Attendance Management Services
export const attendanceService = {
  // Create attendance records
  createAttendanceRecords: async (attendanceData) => {
    try {
      const response = await adminClient.post('/admin/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create attendance records');
    }
  },

  // Get attendance records
  getAttendanceRecords: async (filters = {}) => {
    try {
      const response = await adminClient.get('/admin/attendance', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance records');
    }
  },

  // Update attendance record
  updateAttendanceRecord: async (recordId, recordData) => {
    try {
      const response = await adminClient.put(`/admin/attendance/${recordId}`, recordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update attendance record');
    }
  }
};

export default {
  userService,
  systemService,
  assignmentService,
  attendanceService
};
