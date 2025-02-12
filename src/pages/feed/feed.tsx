import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading: isFeedLoading } = useSelector(
    (state) => state.feed
  );
  const { ingredients, isLoading: isIngredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    if (!orders.length && !isFeedLoading) {
      dispatch(fetchFeed()).catch((error) => console.error(error));
    }

    if (!ingredients.length && !isIngredientsLoading) {
      dispatch(fetchIngredients()).catch((error) => console.error(error));
    }
  }, [
    dispatch,
    orders.length,
    isFeedLoading,
    ingredients.length,
    isIngredientsLoading
  ]);

  if (isFeedLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
