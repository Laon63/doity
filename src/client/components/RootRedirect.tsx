import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from 'client/store/authStore';

const RootRedirect: React.FC = () => {
  const session = useAuthStore((state) => state.session);

  if (session) {
    return <Navigate to="/todo" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;
