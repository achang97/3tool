import { createApi } from '@reduxjs/toolkit/query/react';
import { Tool } from '@app/types';
import { HYDRATE } from 'next-redux-wrapper';
import { baseQueryWithReauth } from './common/baseQuery';

export const toolsApi = createApi({
  reducerPath: 'toolsApi',
  tagTypes: ['Tool'],
  baseQuery: baseQueryWithReauth,
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
      Pick<Tool, '_id'> & Partial<Pick<Tool, 'name' | 'components' | 'actions'>>
    >({
      query: ({ _id, ...body }) => ({
        url: `/tools/${_id}`,
        method: 'PUT',
        body,
      }),
      // NOTE: Adding this field causes a GET to fire after every PUT in the editor, which is
      // unnecessary (as the updated tool object is already returned from the PUT endpoint).
      // invalidatesTags: ['Tool'],
    }),
  }),
});

export const {
  useGetToolByIdQuery,
  useGetToolsQuery,
  useCreateToolMutation,
  useUpdateToolMutation,
} = toolsApi;
