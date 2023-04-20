import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  useApplyForgotPasswordMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
} from '../auth';

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

  describe('useForgotPasswordMutation', () => {
    it('calls fetch to POST /auth/forgotPassword', async () => {
      const mockBody = {
        email: 'email@test.com',
      };

      const { result } = renderHook(() => useForgotPasswordMutation());
      const [submitForgotPassword] = result.current;

      await act(async () => {
        await submitForgotPassword(mockBody);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/auth/forgotPassword',
            _bodyInit: JSON.stringify(mockBody),
          })
        );
      });
    });
  });

  describe('useApplyForgotPassword', () => {
    it('calls fetch to POST /auth/forgotPassword/apply', async () => {
      const mockBody = {
        forgotPasswordToken: 'forgotPasswordToken',
        password: 'password',
      };

      const { result } = renderHook(() => useApplyForgotPasswordMutation());
      const [applyForgotPassword] = result.current;

      await act(async () => {
        await applyForgotPassword(mockBody);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/auth/forgotPassword/apply',
            _bodyInit: JSON.stringify(mockBody),
          })
        );
      });
    });
  });
});
