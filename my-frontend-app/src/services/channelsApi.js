import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import routes from './routes';

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: routes.api.channels,
    prepareHeaders: async (headers, { getState }) => {
      const accessToken = getState().user.token;
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
    },
  }),
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '',
    }),
    addChannel: builder.mutation({
      query: (newChannel) => ({
        method: 'POST',
        body: newChannel,
      }),
    }),
    editChannel: builder.mutation({
      query: ({ id, ...name }) => ({
        url: id.toString(),
        method: 'PATCH',
        body: name,
      }),
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: id.toString(),
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useEditChannelMutation,
  useRemoveChannelMutation,
} = channelsApi;
