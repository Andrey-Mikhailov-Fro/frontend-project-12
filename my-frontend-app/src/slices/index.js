import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import authDataReducer from './authSlice';
import messagesDataReducer from './messagesSlice';
import channelsDataReducer from './channelsSlice';
import { authApi } from '../services/authApi';
import { channelsApi } from '../services/channelsApi';
import { messagesApi } from '../services/messagesApi';
import i18nextInstance from '../services/i18nextInstance';

const errorHandlerMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const customError = action.payload;
    if (customError.status !== 409) {
      return toast.error(i18nextInstance.t('toasts.connectionError'));
    }
  }
  return next(action);
};

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
    .concat(messagesApi.middleware)
    .concat(errorHandlerMiddleware),
});
