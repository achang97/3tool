import { render } from '@tests/utils/renderWithContext';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useUpdateMyUserMutation } from '@app/redux/services/users';
import { mockApiSuccessResponse } from '@tests/constants/api';
import { UpdatePassword } from '../UpdatePassword';

jest.mock('@app/redux/services/users', () => ({
  __esModule: true,
  ...jest.requireActual('@app/redux/services/users'),
  useUpdateMyUserMutation: jest.fn(),
}));

const mockUpdateMyUser = jest.fn(() => mockApiSuccessResponse) as unknown as jest.MockWithArgs<
  ReturnType<typeof useUpdateMyUserMutation>[0]
>;

describe('UpdatePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUpdateMyUserMutation as jest.Mock).mockImplementation(
      jest.fn(() => [mockUpdateMyUser, {}])
    );
  });

  it('renders dummy textbox and "Change Password" button by default', () => {
    render(<UpdatePassword />);

    const dummyPasswordTextbox = screen.getByDisplayValue(/dummy password/i);
    const changePasswordButton = screen.getByRole('button', { name: /change password/i });

    expect(dummyPasswordTextbox).toBeVisible();
    expect(dummyPasswordTextbox).toBeDisabled();
    expect(changePasswordButton).toBeVisible();
  });

  it('renders "new password" & "confirm password" textboxes and "Save new password" button on "Change Password" button click', async () => {
    render(<UpdatePassword />);

    await userEvent.click(screen.getByRole('button', { name: /change password/i }));
    const newPasswordTextbox = screen.getByLabelText(/choose new password/i);
    const confirmPasswordTextbox = screen.getByLabelText(/confirm new password/i);
    const saveNewPasswordButton = screen.getByRole('button', { name: /save new password/i });

    expect(newPasswordTextbox).toBeVisible();
    expect(newPasswordTextbox).toHaveValue('');
    expect(confirmPasswordTextbox).toBeVisible();
    expect(confirmPasswordTextbox).toHaveValue('');
    expect(saveNewPasswordButton).toBeVisible();
  });

  describe('"Save new password" button', () => {
    it('disables "Save new password" button if either or both password textboxes are empty', async () => {
      render(<UpdatePassword />);
      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      await userEvent.clear(screen.getByLabelText(/choose new password/i));
      await userEvent.clear(screen.getByLabelText(/confirm new password/i));
      expect(screen.getByRole('button', { name: /save new password/i })).toBeDisabled();

      await userEvent.type(screen.getByLabelText(/choose new password/i), 'password_1');
      await userEvent.clear(screen.getByLabelText(/confirm new password/i));
      expect(screen.getByRole('button', { name: /save new password/i })).toBeDisabled();

      await userEvent.clear(screen.getByLabelText(/choose new password/i));
      await userEvent.type(screen.getByLabelText(/confirm new password/i), 'password_1');
      expect(screen.getByRole('button', { name: /save new password/i })).toBeDisabled();
    });

    it('displays error and disables "Save new password" button if different passwords are entered in textboxes', async () => {
      render(<UpdatePassword />);
      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();

      await userEvent.type(screen.getByLabelText(/choose new password/i), 'password_1');
      await userEvent.type(screen.getByLabelText(/confirm new password/i), 'password_2');

      expect(screen.getByText(/passwords do not match/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /save new password/i })).toBeDisabled();
    });

    it('calls updateMyUser with updated password if same password is entered textboxes and "Save new password" button is clicked', async () => {
      const newPassword = 'password_1';
      render(<UpdatePassword />);

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));
      await userEvent.type(screen.getByLabelText(/choose new password/i), newPassword);
      await userEvent.type(screen.getByLabelText(/confirm new password/i), newPassword);
      await userEvent.click(screen.getByRole('button', { name: /save new password/i }));

      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
      expect(mockUpdateMyUser).toHaveBeenCalledWith<Parameters<typeof mockUpdateMyUser>>({
        password: newPassword,
      });
    });

    it('automatically comes out of the edit mode on successful password update', async () => {
      const newPassword = 'password_1';
      render(<UpdatePassword />);

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));
      await userEvent.type(screen.getByLabelText(/choose new password/i), newPassword);
      await userEvent.type(screen.getByLabelText(/confirm new password/i), newPassword);
      await userEvent.click(screen.getByRole('button', { name: /save new password/i }));

      expect(screen.queryByLabelText(/choose new password/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/confirm new password/i)).not.toBeInTheDocument();
      expect(screen.getByDisplayValue(/dummy password/i)).toBeVisible();
    });
  });
});
