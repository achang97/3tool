import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Tool } from '@app/types';
import { getItem, setItem } from '@app/utils/storage';

const defaultTools: Tool[] = [];

export const toolsApi = createApi({
  reducerPath: 'toolsApi',
  tagTypes: ['Tool'],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getTools: builder.query<Tool[], void>({
      queryFn: () => {
        const tools = getItem<Tool[]>('tools') || defaultTools;
        return { data: tools };
      },
      providesTags: ['Tool'],
    }),
    getToolById: builder.query<Tool, string>({
      queryFn: (id) => {
        const tools = getItem<Tool[]>('tools') || defaultTools;
        const tool = tools.find((t) => t._id === id);
        return tool ? { data: tool } : { error: { status: 404, data: 'Tool not found' } };
      },
      providesTags: ['Tool'],
    }),
    createTool: builder.mutation<Tool, { name: string }>({
      queryFn: (newTool) => {
        const tools = getItem<Tool[]>('tools') || defaultTools;
        const toolWithId: Tool = {
          ...newTool,
          _id: Date.now().toString(),
          components: [],
          actions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedTools = [...tools, toolWithId];
        setItem('tools', updatedTools);
        return { data: toolWithId };
      },
      invalidatesTags: ['Tool'],
    }),
    updateTool: builder.mutation<
      Tool,
      Pick<Tool, '_id'> & Partial<Pick<Tool, 'name' | 'components' | 'actions'>>
    >({
      queryFn: ({ _id, ...updates }) => {
        const tools = getItem<Tool[]>('tools') || defaultTools;
        const toolIndex = tools.findIndex((t) => t._id === _id);
        if (toolIndex === -1) {
          return { error: { status: 404, data: 'Tool not found' } };
        }
        const updatedTool = { ...tools[toolIndex], ...updates };
        const updatedTools = [
          ...tools.slice(0, toolIndex),
          updatedTool,
          ...tools.slice(toolIndex + 1),
        ];
        setItem('tools', updatedTools);
        return { data: updatedTool };
      },
    }),
  }),
});

export const {
  useGetToolByIdQuery,
  useGetToolsQuery,
  useCreateToolMutation,
  useUpdateToolMutation,
} = toolsApi;
