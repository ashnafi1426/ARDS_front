import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API endpoints
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
};

export const studentAPI = {
  getDashboard: () => apiClient.get('/student/dashboard'),
  getProfile: () => apiClient.get('/student/profile'),
  updateProfile: (data) => apiClient.put('/student/profile', data),
  getRiskStatus: () => apiClient.get('/student/risk-status'),
  submitSelfAssessment: (data) => apiClient.post('/student/self-assessment', data),
  getNotifications: () => apiClient.get('/student/notifications'),
  markNotificationAsRead: (id) => apiClient.put(`/student/notifications/${id}/read`),
};

export const advisorAPI = {
  getDashboard: () => apiClient.get('/advisor/dashboard'),
  getStudents: () => apiClient.get('/advisor/students'),
  getStudentDetails: (studentId) => apiClient.get(`/advisor/students/${studentId}`),
  createIntervention: (data) => apiClient.post('/advisor/interventions', data),
  getInterventions: () => apiClient.get('/advisor/interventions'),
  updateIntervention: (id, data) => apiClient.put(`/advisor/interventions/${id}`, data),
  getReports: () => apiClient.get('/advisor/reports'),
  getProfile: () => apiClient.get('/advisor/profile'),
  updateProfile: (data) => apiClient.put('/advisor/profile', data),
};

export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getUsers: () => apiClient.get('/admin/users'),
  createUser: (data) => apiClient.post('/admin/users', data),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  getSystemStats: () => apiClient.get('/admin/system-stats'),
  getAuditLogs: () => apiClient.get('/admin/audit-logs'),
  updateConfiguration: (data) => apiClient.put('/admin/configuration', data),
};
