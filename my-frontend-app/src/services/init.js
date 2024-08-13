import { toast } from 'react-toastify';
import io from 'socket.io-client';
import filter from 'leo-profanity';
import store from '../slices/index';
import {
  newChannel, updateChannel, removeChannel, setActive,
} from '../slices/channelsSlice';
import { newMessage, removeMessage } from '../slices/messagesSlice';
import i18nextInstance, { initializeI18next } from './i18nextInstance';

const runApp = async () => {
  await initializeI18next();

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

  const rollbarConfig = {
    accessToken: store.getState().user.token,
    environment: process.env.NODE_ENV,
  };

  filter.loadDictionary(navigator.language);

  return [rollbarConfig, filter];
};

export default runApp;
