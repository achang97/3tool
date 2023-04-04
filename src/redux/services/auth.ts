import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from '@app/types';
import { baseQueryWithReauth } from './common/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<
      User & {
        accessToken: string;
        refreshToken: string;
      },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
