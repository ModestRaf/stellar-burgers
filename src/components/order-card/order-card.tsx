import { FC, memo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isLoading = useSelector((state) => state.ingredients.isLoading);

  useEffect(() => {
    if (!ingredients.length && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientMap = new Map(
      ingredients.map((ingredient) => [ingredient._id, ingredient])
    );

    const ingredientsInfo = order.ingredients
      .map((id) => ingredientMap.get(id))
      .filter(Boolean) as TIngredient[];

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow: ingredientsInfo.slice(0, maxIngredients),
      remains: Math.max(0, ingredientsInfo.length - maxIngredients),
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
