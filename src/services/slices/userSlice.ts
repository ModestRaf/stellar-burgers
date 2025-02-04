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
  errorMessage: string | null;
  refreshToken: string;
  accessToken: string;
  user: TUser | null;
  orders: TOrder[];
  orderRequest: boolean;
};

const initialState: TUserState = {
  isLoading: false,
  isError: false,
  errorMessage: null,
  refreshToken: localStorage.getItem('refreshToken') ?? '',
  accessToken: '',
  user: null,
  orders: [],
  orderRequest: false
};

const handleAuthFulfilled = (state: TUserState, action: any) => {
  state.isLoading = false;
  state.isError = false;
  state.errorMessage = null;
  state.refreshToken = action.payload.refreshToken;
  state.accessToken = action.payload.accessToken;
  localStorage.setItem('refreshToken', action.payload.refreshToken);
  setCookie('accessToken', action.payload.accessToken);
  state.user = action.payload.user;
};

const handleRejected = (state: TUserState, action: any) => {
  state.isLoading = false;
  state.isError = true;
  state.errorMessage = action.error.message ?? 'Ошибка запроса';
};

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
});

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(user);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'user/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
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
      .addCase(login.fulfilled, handleAuthFulfilled)
      .addCase(login.rejected, handleRejected)
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, handleAuthFulfilled)
      .addCase(register.rejected, handleRejected)
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUserData.rejected, handleRejected)
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
        state.user = null;
        state.accessToken = '';
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      });
  }
});

export default userSlice.reducer;
