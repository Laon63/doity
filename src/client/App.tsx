import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from 'client/components/Sidebar';
import useAuthStore from 'client/store/authStore';
import { supabase } from 'client/lib/supabaseClient';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          // User is logged in
          if (
            location.pathname === '/login' ||
            location.pathname === '/signup'
          ) {
            navigate('/today');
          }
        } else {
          // User is logged out
          if (
            location.pathname !== '/login' &&
            location.pathname !== '/signup'
          ) {
            navigate('/login');
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname, setSession]);

  // Render Sidebar only if not on login/signup pages
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
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
