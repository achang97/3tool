import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { ApiError, Resource } from '@app/types';
import { API_BASE_URL } from '@app/utils/constants';

export const resourcesApi = createApi({
  reducerPath: 'resourcesApi',
  tagTypes: ['Resource'],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    ApiError,
    {}
  >,
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
      Pick<Resource, 'name' | 'type' | 'metadata'>
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
      Pick<Resource, 'id' | 'name' | 'metadata'>
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
