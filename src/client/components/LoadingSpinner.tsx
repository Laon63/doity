import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

function LoadingSpinner({ fullScreen = false }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: fullScreen ? '100vh' : '100%',
        width: '100%',
        position: fullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        backgroundColor: fullScreen ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        zIndex: (theme) => (fullScreen ? theme.zIndex.drawer + 1 : 'auto'),
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default LoadingSpinner;