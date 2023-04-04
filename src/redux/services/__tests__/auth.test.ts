import { act } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import { useLoginMutation, useLogoutMutation } from '../auth';

const mockResponse = new Response('response');

describe('resources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation(() => mockResponse);
  });

  describe('useLoginMutation', () => {
    it('calls fetch to POST /auth/login', async () => {
      const mockBody = {
        email: 'andrew@tryelixir.io',
        password: '123',
      };
      const { result } = renderHook(() => useLoginMutation());
      const [login] = result.current;

      await act(async () => {
        await login(mockBody);
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/auth/login',
          _bodyInit: JSON.stringify(mockBody),
        })
      );
    });
  });

  describe('useLogoutMutation', () => {
    it('calls fetch to POST /auth/logout', async () => {
      const { result } = renderHook(() => useLogoutMutation());
      const [logout] = result.current;

      await act(async () => {
        await logout();
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/auth/logout',
        })
      );
    });
  });
});
