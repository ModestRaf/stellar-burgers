import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

type TFeedState = {
  isLoading: boolean;
  isError: boolean;
  feed: {
    total: number;
    totalToday: number;
  };
  orders: TOrder[];
};

const initialState: TFeedState = {
  isLoading: false,
  isError: false,
  feed: {
    total: 0,
    totalToday: 0
  },
  orders: []
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchFeed.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.feed.total = payload.total;
        state.feed.totalToday = payload.totalToday;
        state.orders = payload.orders;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  }
});

export default feedSlice.reducer;
