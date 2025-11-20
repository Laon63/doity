import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import TodayPage from './pages/today';
import CalendarPage from './pages/calendar';
import MemoPage from './pages/memo';
import SettingsPage from './pages/settings';
import LogoutPage from './pages/logout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <TodayPage />,
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
