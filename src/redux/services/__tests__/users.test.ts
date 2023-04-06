import { waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import { useGetMyUserQuery } from '../users';

const mockResponse = new Response('response');

describe('users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation(() => mockResponse);
  });

  describe('useGetMyUserQuery', () => {
    it('calls fetch to GET /users/me', async () => {
      renderHook(() => useGetMyUserQuery());

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: '/users/me',
          })
        );
      });
    });
  });
});
