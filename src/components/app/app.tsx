import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import ProtectedRoute from '../../services/ProtectedRoute';
import { ReactNode } from 'react';

interface ModalWithNavigationProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const ModalWithNavigation = ({
  title,
  children,
  onClose
}: ModalWithNavigationProps) => (
  <Modal title={title} onClose={onClose}>
    {children}
  </Modal>
);

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  interface LocationState {
    background?: Location;
    from?: { pathname: string };
  }
  const locationState = location.state as LocationState;
  const background = locationState?.background;
  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* Основные маршруты */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Страницы, доступные только НЕавторизованным пользователям */}
        <Route element={<ProtectedRoute onlyUnAuth redirectTo='/profile' />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        {/* Защищенные маршруты (только для авторизованных пользователей) */}
        <Route element={<ProtectedRoute redirectTo='/login' />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Маршруты для модальных окон */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <ModalWithNavigation
                title='Детали заказа'
                onClose={handleModalClose}
              >
                <OrderInfo />
              </ModalWithNavigation>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ModalWithNavigation
                title='Детали заказа'
                onClose={handleModalClose}
              >
                <OrderInfo />
              </ModalWithNavigation>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <ModalWithNavigation
                title='Детали ингредиента'
                onClose={handleModalClose}
              >
                <IngredientDetails />
              </ModalWithNavigation>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
