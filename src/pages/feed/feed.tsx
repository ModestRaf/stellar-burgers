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
    dispatch(fetchFeed())
      .unwrap()
      .then((data) => console.log('Feed data loaded:', data))
      .catch((error) => console.error('Failed to load feed data:', error));

    if (!ingredients.length && !isIngredientsLoading) {
      dispatch(fetchIngredients())
        .unwrap()
        .then((data) => console.log('Ingredients loaded:', data))
        .catch((error) => console.error('Failed to load ingredients:', error));
    }
  }, [dispatch, ingredients.length, isIngredientsLoading]);
  if (isFeedLoading || isIngredientsLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
