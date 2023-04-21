import { User, UserInvite } from '@app/types';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  useGetCompanyUsersQuery,
  useGetPendingCompanyInvitesQuery,
  useSendCompanyInviteMutation,
  useUpdateCompanyUserMutation,
} from '../companies';

const mockResponse = new Response('response');

describe('companyUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation(() => mockResponse);
  });

  describe('useGetCompanyUsersQuery', () => {
    it('calls fetch to GET /companies/my/users', async () => {
      renderHook(() => useGetCompanyUsersQuery());

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: `/companies/my/users`,
          })
        )
      );
    });
  });

  describe('useUpdateCompanyUserMutation', () => {
    it('calls fetch to POST /companies/my/invite', async () => {
      const mockId = '1';
      const mockBody: Pick<User, 'roles'> = {
        roles: {
          isAdmin: true,
          isEditor: false,
          isViewer: false,
        },
      };
      const { result } = renderHook(() => useUpdateCompanyUserMutation());
      const [updateCompanyUser] = result.current;

      await act(async () => {
        await updateCompanyUser({ _id: mockId, ...mockBody });
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: `/companies/my/users/${mockId}`,
          _bodyInit: JSON.stringify(mockBody),
        })
      );
    });
  });

  describe('useGetPendingCompanyInvitesQuery', () => {
    it('calls fetch to GET /companies/my/invites?status=pending', async () => {
      renderHook(() => useGetPendingCompanyInvitesQuery());

      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: `/companies/my/invites?status=pending`,
          })
        )
      );
    });
  });

  describe('useSendCompanyInviteMutation', () => {
    it('calls fetch to POST /companies/my/invite', async () => {
      const mockBody: Pick<UserInvite, 'email' | 'roles'> = {
        email: 'example@gmail.com',
        roles: {
          isAdmin: true,
          isEditor: false,
          isViewer: false,
        },
      };
      const { result } = renderHook(() => useSendCompanyInviteMutation());
      const [sendCompanyInvite] = result.current;

      await act(async () => {
        await sendCompanyInvite(mockBody);
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/companies/my/invite',
          _bodyInit: JSON.stringify(mockBody),
        })
      );
    });
  });
});
