/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api';

const initialState = { user: '', token: '' };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { user, token } = payload;
        state.token = token;
        state.user = user;
      },
    );
  },
});

export default slice.reducer;
