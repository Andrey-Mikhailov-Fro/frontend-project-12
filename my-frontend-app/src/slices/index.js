import { configureStore } from '@reduxjs/toolkit';
import authDataReducer from './authSlice';
import { authApi } from '../api';

export default configureStore({
  reducer: {
    user: authDataReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});
