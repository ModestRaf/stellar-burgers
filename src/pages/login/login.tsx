import { FC, SyntheticEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // Вызов авторизации
      console.log('Успешный вход!');
    } catch (error) {
      console.error('Ошибка входа:', error);
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
