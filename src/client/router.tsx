import { createBrowserRouter } from 'react-router-dom';
import App from 'client/App';
import TodayPage from 'client/pages/today';
import CalendarPage from 'client/pages/calendar';
import MemoPage from 'client/pages/memo';
import SettingsPage from 'client/pages/settings';
import LogoutPage from 'client/pages/logout';
import LoginPage from 'client/pages/login';
import SignupPage from 'client/pages/signup';
import RootRedirect from 'client/components/RootRedirect'; // Import RootRedirect

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
    children: [
      {
        path: '/',
        element: <RootRedirect />,
      },
      {
        path: 'today',
        element: <TodayPage />,
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
