import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface ScrollableProps extends BoxProps {
  children: React.ReactNode;
}

const Scrollable = React.forwardRef<HTMLDivElement, ScrollableProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '4px',
            '&:hover': {
              background: '#94a3b8',
            },
            '&:active': {
              background: '#64748b',
            },
          },
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  }
);

Scrollable.displayName = 'Scrollable';

export default Scrollable;
