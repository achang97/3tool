import { createApi } from '@reduxjs/toolkit/query/react';
import { User, UserInvite } from '@app/types';
import { baseQueryWithReauth } from './common/baseQuery';

export const companiesApi = createApi({
  reducerPath: 'companiesApi',
  tagTypes: ['CompanyUsers', 'CompanyInvites'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCompanyUsers: builder.query<User[], void>({
      query: () => '/companies/my/users',
      providesTags: ['CompanyUsers'],
    }),
    updateCompanyUser: builder.mutation<User, Pick<User, '_id' | 'roles'>>({
      query: ({ _id, ...body }) => ({
        url: `/companies/my/users/${_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CompanyUsers'],
    }),
    getPendingCompanyInvites: builder.query<UserInvite[], void>({
      query: () => '/companies/my/invites?status=pending',
      providesTags: ['CompanyInvites'],
    }),
    sendCompanyInvite: builder.mutation<void, Pick<UserInvite, 'email' | 'roles'>>({
      query: (body) => ({
        url: '/companies/my/invite',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CompanyInvites'],
    }),
  }),
});

export const {
  useGetCompanyUsersQuery,
  useUpdateCompanyUserMutation,
  useGetPendingCompanyInvitesQuery,
  useSendCompanyInviteMutation,
} = companiesApi;
