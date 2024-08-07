/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

const initialState = { user: '', token: '' };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    refresh: (state) => {
      state.user = localStorage.getItem('user');
      state.token = localStorage.getItem('token');
    },
    quit: (state) => {
      state.token = '';
      state.user = '';
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { username, token } = payload;
        state.token = token;
        state.user = username;
      },
    ).addMatcher(
      authApi.endpoints.signup.matchFulfilled,
      (state, { payload }) => {
        const { username, token } = payload;
        state.token = token;
        state.user = username;
      },
    );
  },
});

export const { refresh, quit } = slice.actions;
export default slice.reducer;
