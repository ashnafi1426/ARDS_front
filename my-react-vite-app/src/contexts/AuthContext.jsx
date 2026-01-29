import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { message } from 'antd';
import { authAPI } from '../services/authAPI';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN_START: 'REFRESH_TOKEN_START',
  REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILURE: 'REFRESH_TOKEN_FAILURE',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set token in localStorage
  const setToken = (token, refreshToken) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // Mock login for testing - replace with actual API call
      if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
        // Mock successful login
        const mockUser = {
          id: '1',
          email: credentials.email,
          role: 'admin', // Default to admin for testing
          full_name: 'Test Admin User'
        };
        
        const mockTokens = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        };
        
        setToken(mockTokens.accessToken, mockTokens.refreshToken);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: mockUser, ...mockTokens },
        });
        message.success('Login successful (Mock Mode)');
        return { success: true };
      }
      
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        setToken(accessToken, refreshToken);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, accessToken, refreshToken },
        });
        message.success('Login successful');
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      message.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null, null);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      message.success('Logged out successfully');
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: null });
      return;
    }

    try {
      // Mock check for testing - replace with actual API call
      if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
        // Mock authenticated user
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          role: 'admin',
          full_name: 'Test Admin User'
        };
        
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: mockUser,
        });
        return;
      }
      
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: response.data.user,
        });
      } else {
        setToken(null, null);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      setToken(null, null);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      return false;
    }

    try {
      const response = await authAPI.refreshToken({ refreshToken: refreshTokenValue });
      if (response.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setToken(accessToken, newRefreshToken);
        return true;
      } else {
        setToken(null, null);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        return false;
      }
    } catch (error) {
      setToken(null, null);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return false;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    ...state,
    login,
    logout,
    checkAuth,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
