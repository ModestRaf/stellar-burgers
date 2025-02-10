import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AppDispatch, RootState, useDispatch, useSelector } from './store';
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
  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(getUserData());
    }
  }, [user, isLoading, dispatch]);
  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
