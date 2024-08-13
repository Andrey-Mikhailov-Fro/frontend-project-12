/* eslint-disable quotes */
/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { channelsApi } from '../services/channelsApi';

const defaultChannel = '1';
const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({ active: defaultChannel });

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    newChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    removeChannel: channelsAdapter.removeOne,
    setActive: (state, action) => {
      state.active = action.payload.toString();
    },
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
export const {
  newChannel, updateChannel, removeChannel, setActive,
} = slice.actions;
export default slice.reducer;
