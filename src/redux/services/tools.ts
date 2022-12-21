import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Tool } from '@app/types';
import { API_BASE_URL } from '@app/utils/constants';

export const toolsApi = createApi({
  reducerPath: 'toolsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getTools: builder.query<Tool[], void>({
      query: () => '/tools',
    }),
    getToolById: builder.query<Tool, string>({
      query: (id) => `/tools/${id}`,
    }),
  }),
});

export const { useGetToolByIdQuery, useGetToolsQuery } = toolsApi;
