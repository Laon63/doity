import React, { Suspense, useEffect } from 'react';
import { Outlet, useLoaderData, useLocation } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import Sidebar from 'client/components/Sidebar';
import useThemeStore from 'client/store/themeStore';
import getTheme from 'client/theme';
import { Profile } from 'client/types';
import i18next from 'i18next';
import LoadingSpinner from 'client/components/LoadingSpinner';
import useAuthStore from 'client/store/authStore';
import { supabase } from 'client/lib/supabaseClient';

function App() {
  const loaderData = useLoaderData();
  const initialProfile = (loaderData && 'id' in loaderData) ? (loaderData as Profile) : null;
  const { setSession } = useAuthStore();
  const location = useLocation();

  // Listen for real-time auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession]);

  // Sync loader data with global stores for other components to use
  const { setPrimaryColor, setLanguage } = useThemeStore();
  useEffect(() => {
    if (initialProfile) {
      setPrimaryColor(initialProfile.theme_color);
      setLanguage(initialProfile.language as Profile['language']);
      i18next.changeLanguage(initialProfile.language);
    }
  }, [initialProfile, setPrimaryColor, setLanguage]);

  // Get primaryColor from Zustand store to ensure reactivity
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const theme = getTheme(primaryColor);

  const showSidebar =
    location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {showSidebar && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            backgroundColor: (theme) => theme.palette.grey[50],
            overflow: 'auto',
          }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
