import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton, Toolbar, AppBar } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Sidebar from 'client/components/Sidebar';
import Logo from 'client/components/Logo';
import useAuthStore from 'client/store/authStore';
import { supabase } from 'client/lib/supabaseClient';
import { APP_NAME } from 'client/contants';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const session = useAuthStore((state) => state.session);

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

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {showSidebar && (
        <AppBar position="static" sx={{ backgroundColor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <Logo size={32} bgColor="primary.main" clickable={true} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {APP_NAME}
              </Typography>
            </Box>
            <Box>
              {session ? (
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  title="Logout"
                  sx={{ color: 'text.primary' }}
                >
                  <LogoutIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="inherit"
                  onClick={handleLogin}
                  title="Login"
                  sx={{ color: 'text.primary' }}
                >
                  <LoginIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
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
    </Box>
  );
}

export default App;
