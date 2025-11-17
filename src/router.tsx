import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import CalendarPage from './pages/CalendarPage';
import App from './App'; // App 컴포넌트를 레이아웃으로 사용

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App 컴포넌트를 최상위 레이아웃으로 사용
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'main',
        element: <MainPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: '/', // 기본 경로를 main으로 리다이렉트하거나 다른 페이지로 설정
        element: <MainPage />, // 임시로 MainPage로 설정
      },
    ],
  },
]);

export default router;
