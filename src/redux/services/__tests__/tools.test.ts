import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  useGetToolByIdQuery,
  useGetToolsQuery,
  useCreateToolMutation,
} from '../tools';

const mockResponse = new Response('response');

describe('tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation(() => mockResponse);
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

  describe('useCreateToolMutation', () => {
    it('calls fetch to POST /tools', async () => {
      const mockBody = { name: 'New Tool' };
      const { result } = renderHook(() => useCreateToolMutation());
      const [createTool] = result.current;

      act(() => {
        createTool(mockBody);
      });

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/tools',
            _bodyInit: JSON.stringify(mockBody),
          })
        )
      );
    });
  });
});
