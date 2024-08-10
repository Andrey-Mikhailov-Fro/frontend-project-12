import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import io from 'socket.io-client';
import filter from 'leo-profanity';
import SingInForm from './SignInForm';
import Home from './Home';
import NotFound from './NotFound';
import SingUpForm from './SignUpForm';
import AppContext from './AppContext';
import routes from '../services/routes';
import store from '../slices/index';
import {
  newChannel, updateChannel, removeChannel, setActive,
} from '../slices/channelsSlice';
import { newMessage, removeMessage } from '../slices/messagesSlice';
import i18nextInstance, { initializeI18next } from '../services/i18nextInstance';
import 'react-toastify/dist/ReactToastify.css';

initializeI18next();

/*
localStorage.setItem('token', '');
localStorage.setItem('user', '');
*/

const socket = io();

socket.on('newChannel', (channel) => {
  store.dispatch(newChannel(channel));
  toast.success(i18nextInstance.t('toasts.create'), { closeOnClick: true, toastId: '1' });
});
socket.on('removeChannel', ({ id }) => {
  const { active } = store.getState().channels;
  if (active === id) store.dispatch(setActive('1'));
  store.dispatch(removeChannel(id));
  toast.success(i18nextInstance.t('toasts.delete'), { toastId: '2' });
});
socket.on('renameChannel', (channel) => {
  const changes = { name: channel.name };
  store.dispatch(updateChannel({ id: channel.id, changes }));
  toast.success(i18nextInstance.t('toasts.edit'), { toastId: '3' });
});
socket.on('newMessage', (message) => {
  store.dispatch(newMessage(message));
});
socket.on('removeMessage', ({ id }) => {
  store.dispatch(removeMessage(id));
});

filter.loadDictionary(navigator.language);

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  environment: process.env.NODE_ENV,
};

const App = () => (
  <Provider config={rollbarConfig}>
    <ErrorBoundary>
      <AppContext.Provider value={filter}>
        <BrowserRouter>
          <Routes>
            <Route path={routes.signUp} element={<SingUpForm />} />
            <Route path={routes.login} element={<SingInForm />} />
            <Route path={routes.home} element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </ErrorBoundary>
    <ToastContainer />
  </Provider>
);

export default App;
