/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { messagesApi } from '../services/messagesApi';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    newMessage: messagesAdapter.addOne,
    removeMessage: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      messagesApi.endpoints.getMessages.matchFulfilled,
      (state, { payload }) => {
        messagesAdapter.addMany(state, payload);
      },
    );
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const { newMessage, removeMessage } = slice.actions;
export default slice.reducer;
