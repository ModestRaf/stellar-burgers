import userReducer, {
  login,
  register,
  updateUserData,
  getUserOrders,
  getUserData
} from './userSlice';

const initState = {
  isLoading: false,
  isError: false,
  errorMessage: null,
  refreshToken: '',
  accessToken: '',
  user: null,
  orders: [],
  orderRequest: false
};

describe('Тесты для userSlice', () => {
  describe('Обработка действия login', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      expect(userReducer(undefined, { type: login.pending.type })).toEqual({
        ...initState,
        isLoading: true
      });
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      expect(
        userReducer(undefined, {
          type: login.fulfilled.type,
          payload: {
            refreshToken: 'token',
            accessToken: 'token',
            user: { email: 'test@example.com', name: 'TestUser' }
          }
        })
      ).toEqual({
        ...initState,
        refreshToken: 'token',
        accessToken: 'token',
        user: { email: 'test@example.com', name: 'TestUser' }
      });
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      expect(
        userReducer(undefined, {
          type: login.rejected.type,
          error: { message: 'Login failed' }
        })
      ).toEqual({ ...initState, isError: true, errorMessage: 'Login failed' });
    });
  });

  describe('Обработка действия register', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      expect(userReducer(undefined, { type: register.pending.type })).toEqual({
        ...initState,
        isLoading: true
      });
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      expect(
        userReducer(undefined, {
          type: register.fulfilled.type,
          payload: {
            refreshToken: 'token',
            accessToken: 'token',
            user: { email: 'new@example.com', name: 'NewUser' }
          }
        })
      ).toEqual({
        ...initState,
        refreshToken: 'token',
        accessToken: 'token',
        user: { email: 'new@example.com', name: 'NewUser' }
      });
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      expect(
        userReducer(undefined, {
          type: register.rejected.type,
          error: { message: 'Register failed' }
        })
      ).toEqual({ ...initState, isError: true, errorMessage: 'Register failed' });
    });
  });

  describe('Обработка действия updateUserData', () => {
    test('должен корректно обрабатывать состояние fulfilled', () => {
      expect(
        userReducer(undefined, {
          type: updateUserData.fulfilled.type,
          payload: { user: { email: 'updated@example.com', name: 'UpdatedUser' } }
        })
      ).toEqual({
        ...initState,
        user: { email: 'updated@example.com', name: 'UpdatedUser' }
      });
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      expect(
        userReducer(undefined, {
          type: updateUserData.rejected.type,
          error: { message: 'Update failed' }
        })
      ).toEqual({ ...initState, isError: true, errorMessage: 'Update failed' });
    });
  });

  describe('Обработка действия getUserOrders', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      expect(
        userReducer(undefined, { type: getUserOrders.pending.type })
      ).toEqual({ ...initState, orderRequest: true });
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      expect(
        userReducer(undefined, {
          type: getUserOrders.fulfilled.type,
          payload: [{ _id: '1', name: 'Burger', number: 123, ingredients: [] }]
        })
      ).toEqual({
        ...initState,
        orders: [{ _id: '1', name: 'Burger', number: 123, ingredients: [] }]
      });
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      expect(
        userReducer(undefined, {
          type: getUserOrders.rejected.type,
          error: { message: 'Orders failed' }
        })
      ).toEqual({ ...initState, errorMessage: 'Orders failed' });
    });
  });

  describe('Обработка действия getUserData', () => {
    test('должен корректно обрабатывать состояние pending', () => {
      expect(userReducer(undefined, { type: getUserData.pending.type })).toEqual({
        ...initState,
        isLoading: true
      });
    });

    test('должен корректно обрабатывать состояние fulfilled', () => {
      expect(
        userReducer(undefined, {
          type: getUserData.fulfilled.type,
          payload: { email: 'user@example.com', name: 'User' }
        })
      ).toEqual({
        ...initState,
        isLoading: false,
        user: { email: 'user@example.com', name: 'User' }
      });
    });

    test('должен корректно обрабатывать состояние rejected', () => {
      expect(
        userReducer(undefined, {
          type: getUserData.rejected.type,
          error: { message: 'User fetch failed' }
        })
      ).toEqual({
        ...initState,
        isError: true,
        errorMessage: 'User fetch failed'
      });
    });
  });
});
