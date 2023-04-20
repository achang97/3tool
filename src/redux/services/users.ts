import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from '@app/types';
import { baseQueryWithReauth } from './common/baseQuery';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMyUser: builder.query<User, void>({
      query: () => '/users/me',
    }),
    acceptInvite: builder.mutation<
      {
        user: User;
        accessToken: string;
        refreshToken: string;
      },
      {
        inviteToken: string;
        password: string;
        firstName: string;
        lastName: string;
      }
    >({
      query: (body) => ({
        url: '/users/invite/accept',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetMyUserQuery, useAcceptInviteMutation } = usersApi;
