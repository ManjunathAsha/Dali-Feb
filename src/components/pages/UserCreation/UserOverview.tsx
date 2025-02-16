import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';

const UserOverview: React.FC = () => {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if we're coming from new user creation
    if (location.state?.fromNewUser && location.state?.showSuccessMessage) {
      setShowSuccess(true);
      // Remove the success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, [location]);

  return (
    <>
      {showSuccess && (
        <Alert 
          severity="success"
          sx={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: '#e8f5e9',
            color: '#1b5e20',
            '& .MuiAlert-icon': {
              color: '#2e7d32'
            }
          }}
        >
          Account created successfully!
        </Alert>
      )}
      {/* Rest of your UserOverview component */}
    </>
  );
};

export default UserOverview;
