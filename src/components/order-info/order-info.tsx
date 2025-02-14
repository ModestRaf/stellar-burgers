import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeed } from '../../services/slices/feedSlice';
import { getUserOrders } from '../../services/slices/userSlice';

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
  const location = useLocation();
  const dispatch = useDispatch();

  const { ingredients } = useSelector((state) => state.ingredients);
  const { orders: feedOrders } = useSelector((state) => state.feed);
  const { orders: userOrders } = useSelector((state) => state.user);
  const isProfilePage = location.pathname.includes('/profile/orders');
  const orders = isProfilePage ? userOrders : feedOrders;

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
    if (!feedOrders.length && !isProfilePage) {
      dispatch(fetchFeed());
    }
    if (!userOrders.length && isProfilePage) {
      dispatch(getUserOrders());
    }
  }, [
    dispatch,
    ingredients.length,
    feedOrders.length,
    userOrders.length,
    isProfilePage
  ]);

  const orderData = orders.find((item) => item.number === Number(number));

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
