import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import TodayPage from './pages/today';

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
      // Add other routes here later
    ],
  },
]);

export default router;
