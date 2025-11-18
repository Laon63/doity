import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import CalendarPage from './pages/CalendarPage';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <MainPage />,
          },
          {
            path: 'calendar',
            element: <CalendarPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
