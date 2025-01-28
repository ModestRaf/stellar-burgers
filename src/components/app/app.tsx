import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
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
}

const ModalWithNavigation = ({ title, children }: ModalWithNavigationProps) => {
  const navigate = useNavigate();
  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <Modal title={title} onClose={handleCloseModal}>
      {children}
    </Modal>
  );
};

const App = () => (
  <Router>
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route element={<ProtectedRoute redirectTo='/login' />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ModalWithNavigation title='Детали заказа'>
                <OrderInfo />
              </ModalWithNavigation>
            }
          />
        </Route>
        {/* Модалка ингредиента */}
        <Route
          path='/ingredients/:id'
          element={
            <ModalWithNavigation title='Детали ингредиента'>
              <IngredientDetails />
            </ModalWithNavigation>
          }
        />
        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  </Router>
);

export default App;
