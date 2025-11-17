import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material'; // MUI Box 컴포넌트 사용

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 여기에 공통 헤더, 푸터 등을 추가할 수 있습니다. */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
