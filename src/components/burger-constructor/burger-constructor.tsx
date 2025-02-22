import { FC, useMemo, useCallback } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { closeOrder, orderBurger } from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { constructorItems, orderRequest, orderModalData } = useSelector(
    (state) => state.newOrder
  );
  const user = useSelector(selectUser);

  const onOrderClick = useCallback(() => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(orderBurger(ingredients));
  }, [constructorItems, orderRequest, dispatch, user, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(closeOrder());
  }, [dispatch]);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
