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
      localStorage.setItem('user', '');
      localStorage.setItem('token', '');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { username, token } = payload;
        state.token = token;
        state.user = username;
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
      },
    ).addMatcher(
      authApi.endpoints.signup.matchFulfilled,
      (state, { payload }) => {
        const { username, token } = payload;
        state.token = token;
        state.user = username;
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
      },
    );
  },
});

export const { refresh, quit } = slice.actions;
export default slice.reducer;
