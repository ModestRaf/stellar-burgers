import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { login } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    console.log('Ответ от API:', resultAction);
    if (login.fulfilled.match(resultAction)) {
      navigate(
        state?.locationState?.background?.pathname
          ? state.locationState.background.pathname
          : '/'
      );
    } else {
      console.error('Ошибка входа:', resultAction.error);
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
