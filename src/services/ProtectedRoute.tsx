import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AppDispatch, RootState, useDispatch, useSelector } from './store';
import { getUserData } from './slices/userSlice';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.user);
  const [isUserFetched, setIsUserFetched] = useState(false);

  useEffect(() => {
    if (!user && localStorage.getItem('accessToken')) {
      dispatch(getUserData()).finally(() => setIsUserFetched(true));
    } else {
      setIsUserFetched(true);
    }
  }, [dispatch, user]);
  if (!isUserFetched || isLoading) {
    return <div>Loading...</div>;
  }
  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
