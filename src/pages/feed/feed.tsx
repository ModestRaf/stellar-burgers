import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.feed);
  useEffect(() => {
    dispatch(fetchFeed())
      .unwrap()
      .then((data) => console.log('Feed data loaded:', data))
      .catch((error) => console.error('Failed to load feed data:', error));
  }, [dispatch]);
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
