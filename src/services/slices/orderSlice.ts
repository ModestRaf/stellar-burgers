import { orderBurgerApi } from '@api';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

type TNewOrderState = {
  isLoading: boolean;
  isError: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TNewOrderState = {
  isLoading: false,
  isError: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const orderBurger = createAsyncThunk(
  'newOrder/orderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

export const orderSlice = createSlice({
  name: 'newOrder',
  initialState,
  selectors: {
    getNewOrderData: (state) =>
      state.constructorItems.bun?._id
        ? [
            state.constructorItems.bun._id,
            ...state.constructorItems.ingredients.map((item) => item._id),
            state.constructorItems.bun._id
          ]
        : []
  },
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      action.payload.type !== 'bun'
        ? (state.constructorItems.ingredients = [
            ...state.constructorItems.ingredients,
            { ...action.payload, id: action.payload._id }
          ])
        : (state.constructorItems.bun = {
            ...action.payload,
            id: nanoid()
          });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = state.isLoading = true;
        state.isError = false;
        state.orderModalData = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = state.isLoading = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = state.isLoading = false;
        state.isError = true;
        state.orderModalData = null;
      });
  }
});

export const { addIngredient } = orderSlice.actions;

export default orderSlice.reducer;
