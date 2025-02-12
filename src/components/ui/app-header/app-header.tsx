import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const isConstructorActive = () =>
    location.pathname === '/' || location.pathname.startsWith('/ingredients');
  const isFeedActive = () => location.pathname.startsWith('/feed');
  const isProfileActive = () =>
    location.pathname.startsWith('/profile') || location.pathname === '/login';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} ${isConstructorActive() ? styles.link_active : ''}`}
          >
            <BurgerIcon
              type={isConstructorActive() ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={`${styles.link} ${isFeedActive() ? styles.link_active : ''}`}
          >
            <ListIcon type={isFeedActive() ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <Link
          to={userName ? '/profile' : '/login'}
          className={`${styles.link} ${isProfileActive() ? styles.link_active : ''}`}
        >
          <ProfileIcon type={isProfileActive() ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};
