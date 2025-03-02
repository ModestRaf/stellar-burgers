import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  price: 1255,
  image: 'image-url',
  image_mobile: 'image-mobile-url',
  image_large: 'image-large-url',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420
};

describe('Тесты для ingredientsSlice', () => {
  describe('Обработка асинхронного действия fetchIngredients', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      const action = fetchIngredients.pending('requestId');
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      const action = fetchIngredients.fulfilled([mockIngredient], 'requestId');
      const state = ingredientsReducer(initialState, action);

      expect(state.ingredients).toEqual([mockIngredient]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = fetchIngredients.rejected(
        new Error(errorMessage),
        'requestId'
      );
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
