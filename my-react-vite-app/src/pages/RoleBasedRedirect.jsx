import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Read stored role
    const userRole = localStorage.getItem('role'); // Changed from userRole to role
    const token = localStorage.getItem('token');

    if (!token) {
      // No token, redirect to login
      navigate('/login', { replace: true });
      return;
    }

    // Redirect based on role
    switch (userRole) {
      case 'student':
        navigate('/student/dashboard', { replace: true });
        break;
      case 'advisor':
        navigate('/advisor/dashboard', { replace: true });
        break;
      case 'admin':
        navigate('/admin/dashboard', { replace: true });
        break;
      default:
        // Unknown role, redirect to login
        navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <Spin size="large" />
      <p style={{ marginTop: 16, color: '#666' }}>Redirecting to your dashboard...</p>
    </div>
  );
};

export default RoleBasedRedirect;
