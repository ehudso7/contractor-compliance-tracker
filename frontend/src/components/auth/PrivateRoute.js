import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading, show nothing or a spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If using the Outlet pattern
  if (!Component) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  }

  // If using the component prop pattern
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
