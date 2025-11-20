import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

function LogoutPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  }, [logout, navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Logging out...
      </Typography>
      <Typography variant="body1">
        You are being logged out and redirected to the login page.
      </Typography>
    </Box>
  );
}

export default LogoutPage;
