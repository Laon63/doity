import React from 'react';
import { Box } from '@mui/material';

interface LogoProps {
  bgColor?: string;
  size?: number;
}

function Logo({ bgColor = 'transparent', size = 24 }: LogoProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px', // Optional: add some border-radius
      }}
    >
      <img src="/favicon.svg" alt="logo" style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}

export default Logo;
