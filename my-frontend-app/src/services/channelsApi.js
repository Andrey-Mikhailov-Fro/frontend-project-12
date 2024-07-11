import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/channels',
    prepareHeaders: async (headers) => {
      const accessToken = localStorage.getItem('token');
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
