import { createApi } from '@reduxjs/toolkit/query/react';
import { Resource } from '@app/types';
import { baseQueryWithReauth } from './common/baseQuery';

export const resourcesApi = createApi({
  reducerPath: 'resourcesApi',
  tagTypes: ['Resource'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getResources: builder.query<Resource[], string>({
      query: (name) => `/resources?name=${name}`,
      providesTags: ['Resource'],
    }),
    getResourceById: builder.query<Resource, string>({
      query: (id) => `/resources/${id}`,
      providesTags: ['Resource'],
    }),
    createResource: builder.mutation<
      Resource,
      Pick<Resource, 'name' | 'type' | 'data'>
    >({
      query: (body) => ({
        url: '/resources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Resource'],
    }),
    updateResource: builder.mutation<
      Resource,
      Pick<Resource, 'id'> & Partial<Pick<Resource, 'name' | 'data'>>
    >({
      query: ({ id, ...body }) => ({
        url: `/resources/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Resource'],
    }),
  }),
});

export const {
  useGetResourceByIdQuery,
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
} = resourcesApi;
