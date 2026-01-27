// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADVISOR: 'advisor',
  ADMIN: 'admin',
};

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Risk Colors
export const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7c3aed',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',

  // Student
  STUDENT_PROFILE: '/students/profile',
  STUDENT_DASHBOARD: '/students/dashboard',
  STUDENT_RISK_STATUS: '/students/risk-status',
  STUDENT_SELF_CHECK: '/students/self-check',
  STUDENT_NOTIFICATIONS: '/notifications',

  // Advisor
  ADVISOR_DASHBOARD: '/advisor/dashboard',
  ADVISOR_STUDENTS: '/students',
  ADVISOR_INTERVENTIONS: '/interventions',
  ADVISOR_REPORTS: '/reports',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_STATS: '/stats/dashboard',

  // General
  RISKS: '/risks',
  EVENTS: '/events',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  RISK_ALERT: 'risk_alert',
  INTERVENTION: 'intervention',
  MEETING: 'meeting',
  SYSTEM: 'system',
  ACADEMIC: 'academic',
};

// Intervention Types
export const INTERVENTION_TYPES = {
  MEETING: 'meeting',
  EMAIL: 'email',
  PHONE: 'phone',
  REFERRAL: 'referral',
  ACADEMIC_PLAN: 'academic_plan',
};

// Status Codes
export const STATUS_CODES = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_TIME: 'MMM DD, YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_STUDENT_PERF_DATA: 'last_student_perf_data',
};
