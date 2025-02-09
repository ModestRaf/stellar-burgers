import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie } from '../utils/cookie';
import { AppDispatch, RootState } from './store';
import { getUserData } from './slices/userSlice';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  redirectTo = '/'
}) => {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.user);
  const accessToken = getCookie('accessToken');
  useEffect(() => {
    if (accessToken && !user && !isLoading) {
      dispatch(getUserData());
    }
  }, [accessToken, user, isLoading, dispatch]);
  if (onlyUnAuth && (user || accessToken)) {
    const from = location.state?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }
  if (!onlyUnAuth && !user && !accessToken) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
