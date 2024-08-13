/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  type: '',
  channelToEdit: {
    name: '',
    id: '',
  },
};

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    show: (state) => {
      state.show = true;
    },
    hide: (state) => {
      state.show = false;
      state.type = '';
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setChannelToEdit: (state, action) => {
      const { name, id } = action.payload;
      state.channelToEdit.name = name;
      state.channelToEdit.id = id;
    },
  },
});

export const {
  show, hide, setType, setChannelToEdit,
} = slice.actions;

export default slice.reducer;
