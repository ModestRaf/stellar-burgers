import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from './store';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean; // Опциональный параметр для маршрутов, доступных только неавторизованным
  redirectTo?: string; // Путь для перенаправления
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  redirectTo = '/login'
}) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  console.log('ProtectedRoute: user =', user); // Логируем значение user

  // Если onlyUnAuth = true, то маршрут доступен только для неавторизованных
  if (onlyUnAuth && user) {
    return <Navigate to='/' replace state={{ from: location }} />;
  }

  // Если onlyUnAuth = false, то маршрут доступен только для авторизованных
  if (!onlyUnAuth && !user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Рендерим вложенные маршруты через Outlet
  return <Outlet />;
};

export default ProtectedRoute;
