import { Middleware } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from '../store';

interface AuthAction {
  type: string;
  payload?: {
    refreshToken: string;
    accessToken: string;
  };
}

export const authMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action: unknown) => {
    const authAction = action as AuthAction;
    if (
      authAction.type === 'user/login/fulfilled' ||
      authAction.type === 'user/register/fulfilled'
    ) {
      const { refreshToken, accessToken } = authAction.payload!;
      localStorage.setItem('refreshToken', refreshToken);
      setCookie('accessToken', accessToken);
    }
    if (authAction.type === 'user/logout/fulfilled') {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    }
    return next(authAction);
  };
