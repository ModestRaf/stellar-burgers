import feedReducer, { fetchFeed } from './feedSlice';
import { TOrder } from '@utils-types';

const initialState = {
  isLoading: false,
  isError: false,
  feed: {
    total: 0,
    totalToday: 0
  },
  orders: []
};

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 1,
    ingredients: ['1', '2']
  }
];

describe('Тесты для feedSlice', () => {
  describe('Обработка асинхронного действия fetchFeed', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      const action = fetchFeed.pending('requestId');
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      const action = fetchFeed.fulfilled(
        { orders: mockOrders, total: 1, totalToday: 1, success: true }, // Добавлено поле success
        'requestId'
      );
      const state = feedReducer(initialState, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.feed.total).toBe(1);
      expect(state.feed.totalToday).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(false);
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      const action = fetchFeed.rejected(
        new Error('Ошибка загрузки'),
        'requestId'
      );
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
    });
  });
});
