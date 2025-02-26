import ordersReducer, {
  orderBurger,
  fetchUserOrders,
  deleteIngredient,
  closeOrder,
  closeOrderModal
} from './orderSlice';
import { TConstructorIngredient, TOrder } from '@utils-types';

const initialState = {
  constructorItems: { bun: null, ingredients: [] as TConstructorIngredient[] },
  orderRequest: false,
  orderModalData: null as TOrder | null,
  userOrders: { orders: [] as TOrder[], isLoading: false, error: null }
};

describe('Тесты для ordersSlice', () => {
  describe('Обработка асинхронного действия orderBurger', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      const pendingState = ordersReducer(initialState, { type: orderBurger.pending.type });
      expect(pendingState).toEqual({
        ...initialState,
        orderRequest: true,
        userOrders: { ...initialState.userOrders, isLoading: true }
      });
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      const orderPayload: TOrder = {
        _id: '10',
        status: 'done',
        name: 'Super Burger',
        createdAt: '',
        updatedAt: '',
        number: 999,
        ingredients: []
      };
      const fulfilledState = ordersReducer(initialState, {
        type: orderBurger.fulfilled.type,
        payload: orderPayload
      });
      expect(fulfilledState).toEqual({
        ...initialState,
        orderRequest: false,
        orderModalData: orderPayload,
        userOrders: { ...initialState.userOrders, isLoading: false }
      });
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      const rejectedState = ordersReducer(initialState, {
        type: orderBurger.rejected.type,
        error: { message: 'Ошибка' }
      });
      expect(rejectedState).toEqual({
        ...initialState,
        orderRequest: false,
        userOrders: { ...initialState.userOrders, isLoading: false, error: 'Ошибка' }
      });
    });
  });

  describe('Обработка асинхронного действия fetchUserOrders', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      const pendingState = ordersReducer(initialState, { type: fetchUserOrders.pending.type });
      expect(pendingState).toEqual({
        ...initialState,
        orderRequest: true,
        userOrders: { ...initialState.userOrders, isLoading: true }
      });
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      const ordersPayload: TOrder[] = [
        { _id: '1', status: 'done', name: 'Burger 1', createdAt: '', updatedAt: '', number: 101, ingredients: [] },
        { _id: '2', status: 'pending', name: 'Burger 2', createdAt: '', updatedAt: '', number: 102, ingredients: [] }
      ];
      const fulfilledState = ordersReducer(initialState, {
        type: fetchUserOrders.fulfilled.type,
        payload: ordersPayload
      });
      expect(fulfilledState).toEqual({
        ...initialState,
        orderRequest: false,
        userOrders: { orders: ordersPayload, isLoading: false, error: null }
      });
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      const rejectedState = ordersReducer(initialState, {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка' }
      });
      expect(rejectedState).toEqual({
        ...initialState,
        orderRequest: false,
        userOrders: { orders: [], isLoading: false, error: 'Ошибка' }
      });
    });
  });

  describe('Обработка синхронного действия deleteIngredient', () => {
    test('должен корректно удалять ингредиент из конструктора', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { id: '1', _id: '1', name: 'Cheese', type: 'main', proteins: 10, fat: 5, carbohydrates: 2, calories: 100, image: '', image_large: '', image_mobile: '', price: 50 },
            { id: '2', _id: '2', name: 'Bacon', type: 'main', proteins: 10, fat: 5, carbohydrates: 2, calories: 100, image: '', image_large: '', image_mobile: '', price: 60 }
          ] as TConstructorIngredient[]
        }
      };

      const newState = ordersReducer(stateWithIngredients, deleteIngredient(0));
      expect(newState).toEqual({
        ...stateWithIngredients,
        constructorItems: {
          bun: null,
          ingredients: [stateWithIngredients.constructorItems.ingredients[1]]
        }
      });
    });
  });

  describe('Обработка синхронного действия closeOrder', () => {
    test('должен очищать конструктор и данные модального окна', () => {
      const modifiedState = {
        ...initialState,
        constructorItems: {
          bun: { id: '1', _id: '1', name: 'Bun', type: 'bun', proteins: 10, fat: 5, carbohydrates: 2, calories: 100, image: '', image_large: '', image_mobile: '', price: 30 },
          ingredients: [{ id: '2', _id: '2', name: 'Cheese', type: 'main', proteins: 10, fat: 5, carbohydrates: 2, calories: 100, image: '', image_large: '', image_mobile: '', price: 50 }]
        },
        orderModalData: {
          _id: '3',
          status: 'pending',
          name: 'Order 3',
          createdAt: '',
          updatedAt: '',
          number: 125,
          ingredients: []
        } as TOrder
      };

      const newState = ordersReducer(modifiedState, closeOrder());
      expect(newState).toEqual({
        ...modifiedState,
        constructorItems: { bun: null, ingredients: [] },
        orderModalData: null
      });
    });
  });

  describe('Обработка синхронного действия closeOrderModal', () => {
    test('должен закрывать модальное окно и сбрасывать флаг orderRequest', () => {
      const stateWithModalData = {
        ...initialState,
        orderRequest: true,
        orderModalData: {
          _id: '3',
          status: 'pending',
          name: 'Order 3',
          createdAt: '',
          updatedAt: '',
          number: 126,
          ingredients: []
        } as TOrder
      };

      const newState = ordersReducer(stateWithModalData, closeOrderModal());
      expect(newState).toEqual({
        ...stateWithModalData,
        orderRequest: false,
        orderModalData: null
      });
    });
  });
});
