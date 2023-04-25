import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from '@app/types';
import { baseQueryWithReauth } from './common/baseQuery';
import { companiesApi } from './companies';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMyUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['Users'],
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
    updateMyUser: builder.mutation<
      User,
      Partial<Pick<User, 'firstName' | 'lastName'> & { password: string }>
    >({
      query: (body) => ({
        url: `/users/me`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(companiesApi.util.invalidateTags(['CompanyUsers']));
        } catch {
          /* empty */
        }
      },
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetMyUserQuery, useAcceptInviteMutation, useUpdateMyUserMutation } = usersApi;
