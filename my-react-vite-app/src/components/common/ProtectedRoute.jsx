import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // Check if token exists
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Changed from userRole to role

  // If no token, redirect to login
  if (!token) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <Navigate 
        to="/redirect" 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
