import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { ApiError, Tool } from '@app/types';
import { API_BASE_URL } from '@app/utils/constants';

export const toolsApi = createApi({
  reducerPath: 'toolsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    ApiError,
    {}
  >,
  endpoints: (builder) => ({
    getTools: builder.query<Tool[], void>({
      query: () => '/tools',
    }),
    getToolById: builder.query<Tool, string>({
      query: (id) => `/tools/${id}`,
    }),
    createTool: builder.mutation<Tool, { name: string }>({
      query: (body) => ({
        url: '/tools',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetToolByIdQuery, useGetToolsQuery, useCreateToolMutation } =
  toolsApi;
