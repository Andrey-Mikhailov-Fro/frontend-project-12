import { configureStore } from '@reduxjs/toolkit';
import authDataReducer from './authSlice';
import messagesDataReducer from './messagesSlice';
import channelsDataReducer from './channelsSlice';
import { authApi } from '../services/authApi';
import { channelsApi } from '../services/channelsApi';
import { messagesApi } from '../services/messagesApi';

export default configureStore({
  reducer: {
    channels: channelsDataReducer,
    messages: messagesDataReducer,
    user: authDataReducer,
    [authApi.reducerPath]: authApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(channelsApi.middleware)
    .concat(messagesApi.middleware),
});
