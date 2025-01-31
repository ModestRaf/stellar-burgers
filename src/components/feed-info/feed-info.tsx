import { FC } from 'react';
import { RootState, useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders, feed } = useSelector((state: RootState) => state.feed);
  console.log('Orders:', orders);
  console.log('Feed:', feed);
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
