import { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import getAuth from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authData = await getAuth();
        if (authData && authData.token) {
          setUser(authData);
          console.log('✅ User restored from localStorage:', authData.email);
        }
      } catch (err) {
        console.error('❌ Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Sending login request...');
      
      const response = await authService.login({ email, password });
      
      if (!response || !response.user || !response.token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      // Store user and token using auth service
      authService.storeAuthData(response.user, response.token);
      
      setUser(response.user);
      console.log('✅ Login successful for user:', response.user.email);
      return response.user;
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform form data to match backend expectations
      const registrationData = {
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName || `${userData.firstName} ${userData.lastName}`,
        department: userData.department || null,
        role: userData.role || 'student',
      };
      
      console.log('📝 Sending registration request...');
      
      const response = await authService.register(registrationData);
      
      if (!response || !response.user || !response.token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      // Store user and token using auth service
      authService.storeAuthData(response.user, response.token);
      
      setUser(response.user);
      console.log('✅ Registration successful for user:', response.user.email);
      return response.user;
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🚪 Logging out user');
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✅ User updated:', updatedUser.email);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register: registerUser,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };
};
