import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useEffect, useState } from 'react';

function ProtectedRoute() {
  const session = useAuthStore((state) => state.session);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Give Supabase a moment to initialize the session from storage
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return session ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
