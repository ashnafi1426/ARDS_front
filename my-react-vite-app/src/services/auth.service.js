// Authentication Service - Frontend API Layer
// This service handles all authentication-related API calls
// Similar to Abe Garage service pattern

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

// ============================================
// AUTHENTICATION SERVICES
// ============================================

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} { user, token }
 */
export const login = async (credentials) => {
  try {
    console.log('🔐 Sending login request to:', `${API_URL}/auth/login`);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Login failed';
      console.error('❌ Login failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Login response received:', { 
      user: data.user?.email, 
      hasToken: !!data.token 
    });
    
    return data;
  } catch (error) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - { email, password, full_name, department, role }
 * @returns {Promise} { user, token }
 */
export const register = async (userData) => {
  try {
    console.log('📝 Sending registration request to:', `${API_URL}/auth/register`);
    console.log('📝 Registration data:', { ...userData, password: '***' });

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Registration failed';
      console.error('❌ Registration failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Registration response received:', { 
      user: data.user?.email, 
      hasToken: !!data.token 
    });
    
    return data;
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    throw error;
  }
};

/**
 * Logout user
 * Clears local storage and returns success
 */
export const logout = () => {
  console.log('🚪 Logging out user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true };
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    const user = JSON.parse(userString);
    return user;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
};

/**
 * Get auth token from localStorage
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Store user and token in localStorage
 * @param {Object} user - User object
 * @param {string} token - JWT token
 */
export const storeAuthData = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  console.log('✅ Auth data stored successfully');
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  console.log('✅ Auth data cleared');
};

// ============================================
// EXPORT ALL SERVICES
// ============================================

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getAuthToken,
  isAuthenticated,
  storeAuthData,
  clearAuthData,
};

export default authService;
