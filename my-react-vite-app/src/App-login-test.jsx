import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

// Test Login import
const Login = React.lazy(() => import('./pages/Login'));

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <Spin size="large" />
  </div>
);

const App = () => {
  console.log('🚀 Login Test App rendering');

  return (
    <div>
      <h1>Login Test App</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<div>Home - Go to /login to test</div>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
