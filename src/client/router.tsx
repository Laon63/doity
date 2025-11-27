import { createBrowserRouter } from 'react-router-dom';
import App from 'client/App';
import TodoPage from 'client/pages/todo';
import CalendarPage from 'client/pages/calendar';
import MemoPage from 'client/pages/memo';
import SettingsPage from 'client/pages/settings';
import LogoutPage from 'client/pages/logout';
import LoginPage from 'client/pages/login';
import SignupPage from 'client/pages/signup';
import RootRedirect from 'client/components/RootRedirect';
import { queryClient } from 'client/lib/queryClient';
import { supabase } from 'client/lib/supabaseClient';
import { profileQueryOptions } from 'client/hooks/queries/useProfileQuery';
import { Profile } from 'client/types';
import LoadingSpinner from './components/LoadingSpinner';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <App />,
    hydrateFallbackElement: <LoadingSpinner fullScreen={true} />,
    loader: async (): Promise<Profile | object> => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          return await queryClient.ensureQueryData(
            profileQueryOptions(session.user.id)
          );
        }
      } catch (error) {
        console.error('Error in root loader:', error);
      }
      return {}; // Return an empty object instead of null
    },
    children: [
      {
        path: '/',
        element: <RootRedirect />,
      },
      {
        path: 'todo',
        element: <TodoPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'memo',
        element: <MemoPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'logout',
        element: <LogoutPage />,
      },
    ],
  },
]);

export default router;
