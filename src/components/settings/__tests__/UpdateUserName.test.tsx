import { render } from '@tests/utils/renderWithContext';
import { screen } from '@testing-library/react';
import { useSignedInUser } from '@app/hooks/useSignedInUser';
import { mockUser } from '@tests/constants/data';
import userEvent from '@testing-library/user-event';
import { useUpdateMyUserMutation } from '@app/redux/services/users';
import { mockApiSuccessResponse } from '@tests/constants/api';
import { UpdateUserName } from '../UpdateUserName';

jest.mock('@app/hooks/useSignedInUser');
jest.mocked(useSignedInUser).mockImplementation(() => mockUser);

jest.mock('@app/redux/services/users', () => ({
  __esModule: true,
  ...jest.requireActual('@app/redux/services/users'),
  useUpdateMyUserMutation: jest.fn(),
}));

describe('UpdateUserName', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockUpdateMyUser = jest.fn(() => mockApiSuccessResponse);
    (useUpdateMyUserMutation as jest.Mock).mockImplementation(
      jest.fn(() => [mockUpdateMyUser, {}])
    );
  });

  it('displays textboxes and sets their value and enabled state correctly', () => {
    render(<UpdateUserName />);
    const firstNameTextbox = screen.getByRole('textbox', { name: /first name/i });
    const lastNameTextbox = screen.getByRole('textbox', { name: /last name/i });
    const emailTextbox = screen.getByRole('textbox', { name: /email/i });

    expect(firstNameTextbox).toBeVisible();
    expect(lastNameTextbox).toBeVisible();
    expect(emailTextbox).toBeVisible();

    expect(firstNameTextbox).toHaveValue(mockUser.firstName);
    expect(lastNameTextbox).toHaveValue(mockUser.lastName);
    expect(emailTextbox).toHaveValue(mockUser.email);

    expect(firstNameTextbox).toBeEnabled();
    expect(lastNameTextbox).toBeEnabled();
    expect(emailTextbox).toBeDisabled();
  });

  describe('action buttons visibility', () => {
    it('action buttons are not shown when firstName & lastName in textboxes matches firstName & lastName of signed-in user', async () => {
      render(<UpdateUserName />);

      const firstNameTextbox = screen.getByRole('textbox', { name: /first name/i });
      const lastNameTextbox = screen.getByRole('textbox', { name: /last name/i });
      await userEvent.clear(firstNameTextbox);
      await userEvent.clear(lastNameTextbox);
      await userEvent.type(firstNameTextbox, mockUser.firstName);
      await userEvent.type(lastNameTextbox, mockUser.lastName);

      expect(screen.queryByRole('button', { name: /restore/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
    });

    it('action buttons are shown when firstName is modified', async () => {
      render(<UpdateUserName />);

      const firstNameTextbox = screen.getByRole('textbox', { name: /first name/i });
      await userEvent.clear(firstNameTextbox);
      await userEvent.type(firstNameTextbox, 'Some different firstName');

      expect(screen.getByRole('button', { name: /restore/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /save changes/i })).toBeVisible();
    });

    it('action buttons are shown when lastName is modified', async () => {
      render(<UpdateUserName />);

      const lastNameTextbox = screen.getByRole('textbox', { name: /last name/i });
      await userEvent.clear(lastNameTextbox);
      await userEvent.type(lastNameTextbox, 'Some different lastName');

      expect(screen.getByRole('button', { name: /restore/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /save changes/i })).toBeVisible();
    });
  });

  describe('action buttons click', () => {
    it('restores firstName & lastName textbox states on "Restore" button click', async () => {
      render(<UpdateUserName />);

      const firstNameTextbox = screen.getByRole('textbox', { name: /first name/i });
      const lastNameTextbox = screen.getByRole('textbox', { name: /last name/i });
      await userEvent.clear(firstNameTextbox);
      await userEvent.clear(lastNameTextbox);
      await userEvent.type(firstNameTextbox, 'John');
      await userEvent.type(lastNameTextbox, 'Doe');
      await userEvent.click(screen.getByRole('button', { name: /restore/i }));

      expect(firstNameTextbox).toHaveValue(mockUser.firstName);
      expect(lastNameTextbox).toHaveValue(mockUser.lastName);
    });

    it('calls updateMyUser with updated firstName & lastName on "Save changes" button click', async () => {
      const [mockUpdateMyUser] = useUpdateMyUserMutation();
      render(<UpdateUserName />);

      const firstNameTextbox = screen.getByRole('textbox', { name: /first name/i });
      const lastNameTextbox = screen.getByRole('textbox', { name: /last name/i });
      await userEvent.clear(firstNameTextbox);
      await userEvent.clear(lastNameTextbox);
      await userEvent.type(firstNameTextbox, 'John');
      await userEvent.type(lastNameTextbox, 'Doe');
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(mockUpdateMyUser).toHaveBeenCalledWith<Parameters<typeof mockUpdateMyUser>>({
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });
});
