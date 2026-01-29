import { useState } from 'react';

const UserManagementDebug = () => {
  const [showModal, setShowModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleButtonClick = () => {
    console.log('Button clicked!');
    setClickCount(prev => prev + 1);
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setShowModal(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management Debug</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Click count: {clickCount}</p>
        <button 
          onClick={handleButtonClick}
          style={{
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '300px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Test Modal</h2>
            <p>Modal is working! Click count: {clickCount}</p>
            <button 
              onClick={closeModal}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementDebug;