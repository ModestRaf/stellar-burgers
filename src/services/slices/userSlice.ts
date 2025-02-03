import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  getOrdersApi
} from '@api';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isLoading: boolean;
  isError: boolean;
  refreshToken: string;
  accessToken: string;
  user: TUser | null;
  orders: TOrder[];
  orderRequest: boolean;
};

const initialState: TUserState = {
  isLoading: false,
  isError: false,
  refreshToken: localStorage.getItem('refreshToken') ?? '',
  accessToken: '',
  user: null,
  orders: [],
  orderRequest: false
};

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi(); // Вызов API для выхода
});

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

export const getUserOrders = createAsyncThunk(
  'user/getOrders',
  async () => await getOrdersApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.accessToken = action.payload.accessToken;
        setCookie('accessToken', action.payload.accessToken);
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.accessToken = action.payload.accessToken;
        setCookie('accessToken', action.payload.accessToken);
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.orderRequest = false;
        state.orders = [];
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('Обработка logout.fulfilled');
        state.user = null;
        state.accessToken = '';
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      });
  }
});

export default userSlice.reducer;
