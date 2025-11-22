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
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#d1d5db',
            borderRadius: '4px',
            '&:hover': {
              background: '#9ca3af',
            },
            '&:active': {
              background: '#6b7280',
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
