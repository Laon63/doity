import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  bgColor?: string;
  size?: number;
  clickable?: boolean;
}

function Logo({
  bgColor = 'transparent',
  size = 24,
  clickable = true,
}: LogoProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate('/');
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'opacity 0.2s ease',
        '&:hover': clickable ? { opacity: 0.8 } : {},
      }}
    >
      <img
        src="/favicon.svg"
        alt="logo"
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
}

export default Logo;
