import {
  createAsyncThunk,
  createSlice,
  nanoid,
  isPending,
  isRejected,
  PayloadAction,
  createAction
} from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

type TOrderState = {
  constructorItems: TConstructorState;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  userOrders: TOrdersState;
};

const initialState: TOrderState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  userOrders: { orders: [], isLoading: false, error: null }
};

export const orderBurger = createAsyncThunk<TOrder, string[]>(
  'order/orderBurger',
  async (data) => (await orderBurgerApi(data)).order
);

export const fetchUserOrders = createAsyncThunk<TOrder[], void>(
  'order/fetchUserOrders',
  async () => await getOrdersApi()
);
export const addIngredient = createAction(
  'order/addIngredient',
  (ingredient: TIngredient) => {
    const id = nanoid();
    return {
      payload: {
        ...ingredient,
        id
      }
    };
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        const { type, id } = action.payload;
        if (type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    deleteIngredient: (state, { payload: index }: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      if (!ingredients[index]) {
        throw new Error('Error');
      }
      state.constructorItems.ingredients = ingredients.toSpliced(index, 1);
    },
    closeOrder: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.orderModalData = payload;
      })
      .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
        console.log('Orders fetched successfully:', payload);
        state.userOrders.isLoading = false;
        state.userOrders.orders = payload;
      })
      .addMatcher(isPending(orderBurger, fetchUserOrders), (state) => {
        state.orderRequest = true;
        state.userOrders.isLoading = true;
      })
      .addMatcher(isRejected(orderBurger, fetchUserOrders), (state, action) => {
        state.orderRequest = false;
        state.userOrders.isLoading = false;
        state.userOrders.error =
          action.error.message || 'Ошибка при получении заказов';
      });
  }
});

export const { deleteIngredient, closeOrder } = orderSlice.actions;
export default orderSlice.reducer;
