/* eslint-disable quotes */
/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { channelsApi } from '../services/channelsApi';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    newChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    removeChannel: channelsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      channelsApi.endpoints.getChannels.matchFulfilled,
      (state, { payload }) => {
        channelsAdapter.addMany(state, payload);
      },
    );
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const { newChannel, updateChannel, removeChannel } = slice.actions;
export default slice.reducer;
