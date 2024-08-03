import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import routes from './routes';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: routes.api.messages,
    prepareHeaders: async (headers, { getState }) => {
      const accessToken = getState().user.token;
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
    },
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '',
      keepUnusedDataFor: 0,
    }),
    addMessage: builder.mutation({
      query: (newMessage) => ({
        method: 'POST',
        body: newMessage,
      }),
    }),
    editMessage: builder.mutation({
      query: (id, editedMessage) => ({
        url: id.toString(),
        method: 'PATCH',
        body: editedMessage,
      }),
    }),
    removeMessage: builder.mutation({
      query: (id) => ({
        url: id.toString(),
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useAddMessageMutation,
  useEditMessageMutation,
  useRemoveMessageMutation,
} = messagesApi;
