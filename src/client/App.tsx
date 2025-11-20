import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f7f8fa', // Light lavender background
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>
      {/* TODO: Add TaskDetails panel, which will be conditionally rendered */}
    </Box>
  );
}

export default App;
