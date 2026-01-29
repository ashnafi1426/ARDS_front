import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Test LandingPage import
const LandingPage = React.lazy(() => import('./pages/LandingPage'));

const App = () => {
  console.log('🚀 Test App rendering');

  return (
    <div>
      <h1>Test App - Checking Components</h1>
      <Routes>
        <Route path="/" element={<div>Landing Page Test</div>} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </div>
  );
};

export default App;
