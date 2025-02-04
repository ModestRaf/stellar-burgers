import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const getIngredientsInfo = (
  ingredientsIds: string[],
  ingredients: TIngredient[]
) =>
  ingredientsIds.reduce<Record<string, TIngredient & { count: number }>>(
    (acc, item) => {
      if (!acc[item]) {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          acc[item] = { ...ingredient, count: 1 };
        }
      } else {
        acc[item].count++;
      }
      return acc;
    },
    {}
  );

const getTotalPrice = (
  ingredientsInfo: Record<string, TIngredient & { count: number }>
) =>
  Object.values(ingredientsInfo).reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const { ingredients } = useSelector((state) => state.ingredients);
  const orderData = useSelector((state) =>
    state.feed.orders.find((item) => item.number === Number(number))
  );

  useEffect(() => {
    if (!orderData) dispatch(fetchFeed());
    if (!ingredients.length) dispatch(fetchIngredients());
  }, [dispatch, orderData, ingredients.length]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    const ingredientsInfo = getIngredientsInfo(
      orderData.ingredients,
      ingredients
    );
    const total = getTotalPrice(ingredientsInfo);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
