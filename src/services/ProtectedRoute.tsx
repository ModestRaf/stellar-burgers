import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from './store';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  redirectTo?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  redirectTo = '/login'
}) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  if (onlyUnAuth && user) {
    return <Navigate to='/' replace state={{ from: location }} />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <Outlet />;
};
export default ProtectedRoute;
