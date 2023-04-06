import { ComponentType, Tool } from '@app/types';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  useGetToolByIdQuery,
  useGetToolsQuery,
  useCreateToolMutation,
  useUpdateToolMutation,
} from '../tools';

const mockResponse = new Response('response');

describe('tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation(() => mockResponse);
  });

  describe('useGetToolsQuery', () => {
    it('calls fetch to GET /tools', async () => {
      renderHook(() => useGetToolsQuery());

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({ method: 'GET', url: '/tools' })
        )
      );
    });
  });

  describe('useGetToolByIdQuery', () => {
    it('calls fetch to GET /tools/:id', async () => {
      const mockId = 'toolId';
      renderHook(() => useGetToolByIdQuery(mockId));

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({ method: 'GET', url: `/tools/${mockId}` })
        )
      );
    });
  });

  describe('useCreateToolMutation', () => {
    it('calls fetch to POST /tools', async () => {
      const mockBody = { name: 'New Tool' };
      const { result } = renderHook(() => useCreateToolMutation());
      const [createTool] = result.current;

      await act(async () => {
        await createTool(mockBody);
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/tools',
          _bodyInit: JSON.stringify(mockBody),
        })
      );
    });
  });

  describe('useUpdateToolMutation', () => {
    it('calls fetch to PUT /tools/:id', async () => {
      const mockId = '1';
      const mockBody: Pick<Tool, 'name' | 'components' | 'actions'> = {
        name: 'New Tool',
        components: [
          {
            name: 'button1',
            type: ComponentType.Button,
            layout: {
              w: 1,
              h: 1,
              x: 1,
              y: 1,
            },
            eventHandlers: [],
            data: {},
          },
        ],
        actions: [],
      };
      const { result } = renderHook(() => useUpdateToolMutation());
      const [updateTool] = result.current;

      await act(async () => {
        await updateTool({ _id: mockId, ...mockBody });
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: `/tools/${mockId}`,
          _bodyInit: JSON.stringify(mockBody),
        })
      );
    });
  });
});
