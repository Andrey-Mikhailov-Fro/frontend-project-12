import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import routes from './routes';

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({ baseUrl: routes.api.base }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: routes.login,
        method: 'POST',
        body,
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: routes.signUp,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
