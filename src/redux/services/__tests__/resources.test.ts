import { Resource, ResourceType } from '@app/types';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  useGetResourceByIdQuery,
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} from '../resources';

const mockResponse = new Response('response');

describe('resources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation(() => mockResponse);
  });

  describe('useGetResourceByIdQuery', () => {
    it('calls fetch to GET /resources/:id', async () => {
      const mockId = 'resourceId';
      renderHook(() => useGetResourceByIdQuery(mockId));

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: `/resources/${mockId}`,
          })
        )
      );
    });
  });

  describe('useGetResourcesQuery', () => {
    it('calls fetch to GET /resources', async () => {
      const mockQuery = 'query';
      renderHook(() => useGetResourcesQuery(mockQuery));

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: `/resources?name=${mockQuery}`,
          })
        )
      );
    });
  });

  describe('useCreateResourceMutation', () => {
    it('calls fetch to POST /resources', async () => {
      const mockBody: Pick<Resource, 'type' | 'name' | 'data'> = {
        type: ResourceType.SmartContract,
        name: 'New Resource',
        data: {},
      };
      const { result } = renderHook(() => useCreateResourceMutation());
      const [createResource] = result.current;

      await act(async () => {
        await createResource(mockBody);
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/resources',
          _bodyInit: JSON.stringify(mockBody),
        })
      );
    });
  });

  describe('useUpdateResourceMutation', () => {
    it('calls fetch to PUT /resources', async () => {
      const mockId = '1';
      const mockBody: Pick<Resource, 'type' | 'name' | 'data'> = {
        type: ResourceType.SmartContract,
        name: 'New Resource',
        data: {},
      };
      const { result } = renderHook(() => useUpdateResourceMutation());
      const [updateResource] = result.current;

      await act(async () => {
        await updateResource({ _id: mockId, ...mockBody });
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: `/resources/${mockId}`,
          _bodyInit: JSON.stringify(mockBody),
        })
      );
    });
  });

  describe('useDeleteResourceMutation', () => {
    it('calls fetch to DELETE /resources', async () => {
      const mockId = '1';

      const { result } = renderHook(() => useDeleteResourceMutation());
      const [deleteResource] = result.current;

      await act(async () => {
        await deleteResource({ _id: mockId });
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: `/resources/${mockId}`,
        })
      );
    });
  });
});
