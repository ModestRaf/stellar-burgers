import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.newOrder.userOrders.orders);
  const isLoading = useSelector((state) => state.newOrder.userOrders.isLoading);

  useEffect(() => {
    if (!isLoading && (!orders || orders.length === 0)) {
      console.log('Загружаем заказы...');
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isLoading]);

  return <ProfileOrdersUI orders={orders} />;
};
