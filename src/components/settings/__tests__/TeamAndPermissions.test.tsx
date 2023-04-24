import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { useSignedInUser } from '@app/hooks/useSignedInUser';
import { mockEditorRoleUser, mockUser, mockPendingUserInvite } from '@tests/constants/data';
import {
  useGetCompanyUsersQuery,
  useGetPendingCompanyInvitesQuery,
  useUpdateCompanyUserMutation,
} from '@app/redux/services/companies';
import { mockApiError } from '@tests/constants/api';
import { User, Role } from '@app/types';
import { getUserRolesFlags } from '../utils/userRoleConversion';
import { TeamAndPermissions } from '../TeamAndPermissions';

jest.mock('@app/hooks/useSignedInUser');
jest.mocked(useSignedInUser).mockImplementation(() => mockUser);

jest.mock('@app/redux/services/companies', () => ({
  __esModule: true,
  ...jest.requireActual('@app/redux/services/companies'),
  useGetCompanyUsersQuery: jest.fn(() => ({ data: [] })),
  useGetPendingCompanyInvitesQuery: jest.fn(() => ({ data: [] })),
  useUpdateCompanyUserMutation: jest.fn(() => [jest.fn(), {}]),
}));

describe('TeamAndPermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetCompanyUsersQuery as jest.Mock).mockImplementation(jest.fn(() => ({ data: [] })));
    (useGetPendingCompanyInvitesQuery as jest.Mock).mockImplementation(
      jest.fn(() => ({ data: [] }))
    );
    (useUpdateCompanyUserMutation as jest.Mock).mockImplementation(jest.fn(() => [jest.fn(), {}]));
  });

  describe('Loading', () => {
    it('renders FullscreenLoader when useGetCompanyUsersQuery is in loading state', () => {
      (useGetCompanyUsersQuery as jest.Mock).mockReturnValue({ isLoading: true });
      render(<TeamAndPermissions />);

      expect(screen.getByTestId('fullscreen-loader')).toBeVisible();
    });

    it('renders FullscreenLoader when useGetPendingCompanyInvitesQuery is in loading state', () => {
      (useGetPendingCompanyInvitesQuery as jest.Mock).mockReturnValue({ isLoading: true });
      render(<TeamAndPermissions />);

      expect(screen.getByTestId('fullscreen-loader')).toBeVisible();
    });
  });

  describe('Error handling', () => {
    const queryError = { error: mockApiError, isError: true };

    it('renders "user list" related error messages when only useGetCompanyUsersQuery fails ', () => {
      (useGetCompanyUsersQuery as jest.Mock).mockReturnValue(queryError);
      render(<TeamAndPermissions />);

      expect(
        screen.getByText(
          /oops! it seems that the user list was not properly loaded\. please, reload the page\./i
        )
      ).toBeVisible();
    });

    it('renders "invite list" related error messages when only useGetPendingCompanyInvitesQuery fails', () => {
      (useGetPendingCompanyInvitesQuery as jest.Mock).mockReturnValue(queryError);
      render(<TeamAndPermissions />);

      expect(
        screen.getByText(
          /oops! it seems that the invite list was not properly loaded\. please, reload the page\./i
        )
      ).toBeVisible();
    });

    it('renders "user list" related error messages when both APIs fail', () => {
      (useGetCompanyUsersQuery as jest.Mock).mockReturnValue(queryError);
      (useGetPendingCompanyInvitesQuery as jest.Mock).mockReturnValue(queryError);
      render(<TeamAndPermissions />);

      expect(
        screen.getByText(
          /oops! it seems that the user list was not properly loaded\. please, reload the page\./i
        )
      ).toBeVisible();
    });
  });

  describe('On API success', () => {
    it('renders users', () => {
      (useGetCompanyUsersQuery as jest.Mock).mockReturnValue({ data: [mockUser] });
      render(<TeamAndPermissions />);

      expect(
        screen.getByText(new RegExp(`${mockUser.firstName} ${mockUser.lastName}`, 'i'))
      ).toBeVisible();
      expect(screen.getByRole('button', { name: /admin/i })).toBeVisible();
    });

    it('renders invites', () => {
      (useGetPendingCompanyInvitesQuery as jest.Mock).mockReturnValue({
        data: [mockPendingUserInvite],
      });
      render(<TeamAndPermissions />);

      expect(screen.getByText(new RegExp(mockPendingUserInvite.email, 'i'))).toBeVisible();
      expect(screen.getByText(/pending invite/i)).toBeVisible();
    });

    it('disables the UserRole Select for the signed-in user if the signed-in user is an Admin as well', () => {
      const adminUser: User = { ...mockUser, roles: { ...mockUser.roles, isAdmin: true } };
      jest.mocked(useSignedInUser).mockReturnValue(adminUser);
      (useGetCompanyUsersQuery as jest.Mock).mockReturnValue({ data: [adminUser] });
      render(<TeamAndPermissions />);

      expect(screen.getByRole('button', { name: /admin/i })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    it('calls updateCompanyUser on updating UserRole', async () => {
      (useGetCompanyUsersQuery as jest.Mock).mockReturnValue({ data: [mockEditorRoleUser] });
      (useUpdateCompanyUserMutation as jest.Mock).mockReturnValue([jest.fn(), {}]);
      const [updateCompanyUser] = useUpdateCompanyUserMutation();
      render(<TeamAndPermissions />);

      await userEvent.click(screen.getByRole('button', { name: /editor/i }));
      await userEvent.click(screen.getByRole('option', { name: /viewer/i }));

      expect(updateCompanyUser).toHaveBeenCalledWith<Parameters<typeof updateCompanyUser>>({
        _id: mockEditorRoleUser._id,
        roles: getUserRolesFlags(Role.Viewer),
      });
    });
  });
});
