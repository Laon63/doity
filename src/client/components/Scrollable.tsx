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
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#ccc',
            borderRadius: '3px',
            '&:hover': {
              background: '#999',
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
