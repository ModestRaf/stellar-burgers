import React, { FC, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const { ingredients, isLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const buns: TIngredient[] = ingredients.filter(
    (ingredient: { type: string }) => ingredient.type === 'bun'
  );
  const mains: TIngredient[] = ingredients.filter(
    (ingredient: { type: string }) => ingredient.type === 'main'
  );
  const sauces: TIngredient[] = ingredients.filter(
    (ingredient: { type: string }) => ingredient.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
