import { Resource } from '@app/types/api';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  useGetResourceByIdQuery,
  useGetResourcesQuery,
  useCreateResourceMutation,
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
      const mockBody: Pick<Resource, 'type' | 'name' | 'metadata'> = {
        type: 'smart_contract',
        name: 'New Resource',
        metadata: {},
      };
      const { result } = renderHook(() => useCreateResourceMutation());
      const [createResource] = result.current;

      act(() => {
        createResource(mockBody);
      });

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/resources',
            _bodyInit: JSON.stringify(mockBody),
          })
        )
      );
    });
  });
});
