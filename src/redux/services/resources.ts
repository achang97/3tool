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
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    ApiError,
    {}
  >,
  endpoints: (builder) => ({
    getResources: builder.query<Resource[], string>({
      query: (name) => `/resources?name=${name}`,
    }),
    getResourceById: builder.query<Resource, string>({
      query: (id) => `/resources/${id}`,
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
    }),
  }),
});

export const {
  useGetResourceByIdQuery,
  useGetResourcesQuery,
  useCreateResourceMutation,
} = resourcesApi;
