import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import { useAcceptInviteMutation, useGetMyUserQuery, useUpdateMyUserMutation } from '../users';

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

  describe('useAcceptInviteMutation', () => {
    it('calls fetch to POST /users/invite/accept', async () => {
      const mockBody = {
        inviteToken: 'inviteToken',
        password: 'password',
        firstName: 'Andrew',
        lastName: 'Chang',
      };

      const { result } = renderHook(() => useAcceptInviteMutation());
      const [acceptInvite] = result.current;

      await act(async () => {
        await acceptInvite(mockBody);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/users/invite/accept',
            _bodyInit: JSON.stringify(mockBody),
          })
        );
      });
    });
  });

  describe('useUpdateMyUserMutation', () => {
    it('calls fetch to PUT /users/me', async () => {
      const mockBody = {
        password: 'password',
        firstName: 'Andrew',
        lastName: 'Chang',
      };

      const { result } = renderHook(() => useUpdateMyUserMutation());
      const [updateMyUser] = result.current;

      await act(async () => {
        await updateMyUser(mockBody);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'PUT',
            url: '/users/me',
            _bodyInit: JSON.stringify(mockBody),
          })
        );
      });
    });
  });
});
