import api from '../../config/api';

const advisorApi = {
  // Dashboard data
  getDashboardStats: async () => {
    try {
      const response = await api.get('/advisor/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Students management
  getAssignedStudents: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/advisor/students?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      throw error;
    }
  },

  getStudentDetails: async (studentId) => {
    try {
      const response = await api.get(`/advisor/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  },

  // Risk management
  getRiskDistribution: async (timeframe = 'week') => {
    try {
      const response = await api.get(`/advisor/risk/distribution?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching risk distribution:', error);
      throw error;
    }
  },

  getHighRiskStudents: async () => {
    try {
      const response = await api.get('/advisor/students?riskLevel=high,critical');
      return response.data;
    } catch (error) {
      console.error('Error fetching high risk students:', error);
      throw error;
    }
  },

  // Alerts and notifications
  getRecentAlerts: async (limit = 10) => {
    try {
      const response = await api.get(`/advisor/alerts?limit=${limit}&recent=true`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      throw error;
    }
  },

  markAlertAsRead: async (alertId) => {
    try {
      const response = await api.patch(`/advisor/alerts/${alertId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  },

  markAllAlertsAsRead: async () => {
    try {
      const response = await api.patch('/advisor/alerts/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
      throw error;
    }
  },

  // Assessment compliance
  getComplianceData: async () => {
    try {
      const response = await api.get('/advisor/compliance');
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance data:', error);
      throw error;
    }
  },

  getRecentSubmissions: async (limit = 5) => {
    try {
      const response = await api.get(`/advisor/assessments/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent submissions:', error);
      throw error;
    }
  },

  getOverdueStudents: async () => {
    try {
      const response = await api.get('/advisor/assessments/overdue');
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue students:', error);
      throw error;
    }
  },

  // Student interventions
  addStudentNote: async (studentId, note) => {
    try {
      const response = await api.post(`/advisor/students/${studentId}/notes`, { note });
      return response.data;
    } catch (error) {
      console.error('Error adding student note:', error);
      throw error;
    }
  },

  recommendIntervention: async (studentId, intervention) => {
    try {
      const response = await api.post(`/advisor/students/${studentId}/interventions`, intervention);
      return response.data;
    } catch (error) {
      console.error('Error recommending intervention:', error);
      throw error;
    }
  },

  // Reports
  generateReport: async (reportType, filters = {}) => {
    try {
      const response = await api.post('/advisor/reports/generate', {
        type: reportType,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
};

export default advisorApi;