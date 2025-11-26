import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from 'client/components/Sidebar';
import useAuthStore from 'client/store/authStore';
import { supabase } from 'client/lib/supabaseClient';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuthStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (
          event === 'SIGNED_IN' &&
          (location.pathname === '/login' || location.pathname === '/signup')
        ) {
          navigate('/today');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname, setSession]);

  const showSidebar =
    location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {showSidebar && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: '#f7f8fa',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
