import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import authDataReducer, { quit } from './authSlice';
import messagesDataReducer from './messagesSlice';
import channelsDataReducer from './channelsSlice';
import { authApi } from '../services/authApi';
import { channelsApi } from '../services/channelsApi';
import { messagesApi } from '../services/messagesApi';
import i18nextInstance from '../services/i18nextInstance';

const errorHandlerMiddleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const customError = action.payload.status;
    const serverRejectErrors = [409, 401];
    if (!serverRejectErrors.includes(customError)) {
      toast.error(i18nextInstance.t('toasts.connectionError'));
    }
    if (customError === 401) {
      store.dispatch(quit());
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
