import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { ApiError, Tool } from '@app/types';
import { API_BASE_URL } from '@app/constants';
import { HYDRATE } from 'next-redux-wrapper';

export const toolsApi = createApi({
  reducerPath: 'toolsApi',
  tagTypes: ['Tool'],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    ApiError,
    {}
  >,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
    return undefined;
  },
  endpoints: (builder) => ({
    getTools: builder.query<Tool[], void>({
      query: () => '/tools',
      providesTags: ['Tool'],
    }),
    getToolById: builder.query<Tool, string>({
      query: (id) => `/tools/${id}`,
      providesTags: ['Tool'],
    }),
    createTool: builder.mutation<Tool, { name: string }>({
      query: (body) => ({
        url: '/tools',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tool'],
    }),
    updateTool: builder.mutation<
      Tool,
      Pick<Tool, 'id'> & Partial<Pick<Tool, 'name' | 'components'>>
    >({
      query: ({ id, ...body }) => ({
        url: `/tools/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tool'],
    }),
  }),
});

export const {
  useGetToolByIdQuery,
  useGetToolsQuery,
  useCreateToolMutation,
  useUpdateToolMutation,
  endpoints: { getToolById },
  util: { getRunningQueriesThunk },
} = toolsApi;
