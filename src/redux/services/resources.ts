import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Resource, ResourceWithLinkedActions } from '@app/types';
import { getItem, setItem } from '@app/utils/storage';

const defaultResources: Resource[] = [];

export const resourcesApi = createApi({
  reducerPath: 'resourcesApi',
  tagTypes: ['Resource'],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getResources: builder.query<ResourceWithLinkedActions[], string>({
      queryFn: (name) => {
        const resources = getItem<Resource[]>('resources') || defaultResources;
        const filteredResources = name
          ? resources.filter((resource) => resource.name.includes(name))
          : resources;
        return { data: filteredResources as ResourceWithLinkedActions[] };
      },
      providesTags: ['Resource'],
    }),
    getResourceById: builder.query<Resource, string>({
      queryFn: (id) => {
        const resources = getItem<Resource[]>('resources') || defaultResources;
        const resource = resources.find((r) => r._id === id);
        return resource
          ? { data: resource }
          : { error: { status: 404, data: 'Resource not found' } };
      },
      providesTags: ['Resource'],
    }),
    createResource: builder.mutation<Resource, Pick<Resource, 'type' | 'name' | 'data'>>({
      queryFn: (newResource) => {
        const resources = getItem<Resource[]>('resources') || defaultResources;
        const resourceWithId: Resource = {
          ...newResource,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedResources = [...resources, resourceWithId];
        setItem('resources', updatedResources);
        return { data: resourceWithId };
      },
      invalidatesTags: ['Resource'],
    }),
    updateResource: builder.mutation<
      Resource,
      Pick<Resource, '_id'> & Partial<Pick<Resource, 'name' | 'data'>>
    >({
      queryFn: ({ _id, ...updates }) => {
        const resources = getItem<Resource[]>('resources') || defaultResources;
        const resourceIndex = resources.findIndex((r) => r._id === _id);
        if (resourceIndex === -1) {
          return { error: { status: 404, data: 'Resource not found' } };
        }
        const updatedResource = { ...resources[resourceIndex], ...updates };
        const updatedResources = [
          ...resources.slice(0, resourceIndex),
          updatedResource,
          ...resources.slice(resourceIndex + 1),
        ];
        setItem('resources', updatedResources);
        return { data: updatedResource };
      },
      invalidatesTags: ['Resource'],
    }),
    deleteResource: builder.mutation<Resource, Pick<Resource, '_id'>>({
      queryFn: ({ _id }) => {
        const resources = getItem<Resource[]>('resources') || defaultResources;
        const resourceIndex = resources.findIndex((r) => r._id === _id);
        if (resourceIndex === -1) {
          return { error: { status: 404, data: 'Resource not found' } };
        }
        const deletedResource = resources[resourceIndex];
        const updatedResources = [
          ...resources.slice(0, resourceIndex),
          ...resources.slice(resourceIndex + 1),
        ];
        setItem('resources', updatedResources);
        return { data: deletedResource };
      },
      invalidatesTags: ['Resource'],
    }),
  }),
});

export const {
  useGetResourceByIdQuery,
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourcesApi;
