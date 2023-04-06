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
  }),
});

export const { useGetMyUserQuery } = usersApi;
