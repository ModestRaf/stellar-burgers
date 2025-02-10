import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';
import { useSelector } from '../../services/store';

const maxIngredients = 6;

const getOrderInfo = (
  order: OrderCardProps['order'],
  ingredients: TIngredient[]
) => {
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
};

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const { ingredients } = useSelector((state) => state.ingredients);

  const orderInfo = useMemo(
    () => getOrderInfo(order, ingredients),
    [order, ingredients]
  );

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
