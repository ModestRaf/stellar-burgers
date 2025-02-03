import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { register } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('Отправка данных:', { email, name: userName, password });
    const resultAction = await dispatch(
      register({ email, name: userName, password })
    );
    console.log('Ответ от API:', resultAction);
    if (register.fulfilled.match(resultAction)) {
      navigate(state?.locationState?.background?.pathname || '/');
    }
  };
  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
