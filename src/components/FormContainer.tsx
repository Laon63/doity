import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

function FormContainer({ children }: FormContainerProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

export default FormContainer;
