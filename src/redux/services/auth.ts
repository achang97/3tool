import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from '@app/types';
import { baseQueryWithReauth } from './common/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        user: User;
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
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: '/auth/forgotPassword',
        method: 'POST',
        body,
      }),
    }),
    applyForgotPassword: builder.mutation<
      {
        user: User;
        accessToken: string;
        refreshToken: string;
      },
      {
        forgotPasswordToken: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: '/auth/forgotPassword/apply',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useApplyForgotPasswordMutation,
} = authApi;
