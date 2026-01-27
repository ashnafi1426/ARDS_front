import React from 'react';

const TestPage = () => {
  console.log('✅ TestPage is rendering!');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '48px',
        color: '#333',
        marginBottom: '20px'
      }}>
        ✅ React is Working!
      </h1>
      <p style={{
        fontSize: '24px',
        color: '#666',
        marginBottom: '10px'
      }}>
        If you can see this, the app is rendering correctly.
      </p>
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Pathname:</strong> {window.location.pathname}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a href="/login" style={{
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          marginRight: '10px'
        }}>
          Go to Login
        </a>
        <a href="/" style={{
          padding: '10px 20px',
          backgroundColor: '#10b981',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px'
        }}>
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default TestPage;
