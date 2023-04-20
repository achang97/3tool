import { screen, render } from '@testing-library/react';
import { useAcceptInviteMutation } from '@app/redux/services/users';
import userEvent from '@testing-library/user-event';
import { AcceptInviteForm } from '../AcceptInviteForm';

const mockSubmitAcceptInvite = jest.fn();

const mockEmail = 'andrew@acalabs.xyz';
const mockInviteToken = 'forgotPasswordToken';

jest.mock('@app/redux/services/users', () => ({
  useAcceptInviteMutation: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { email: mockEmail, inviteToken: mockInviteToken },
  })),
}));

describe('AcceptInviteForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAcceptInviteMutation as jest.Mock).mockImplementation(() => [mockSubmitAcceptInvite, {}]);
  });

  it('renders title', () => {
    render(<AcceptInviteForm />);
    expect(screen.getByText('Create an account')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<AcceptInviteForm />);
    expect(
      screen.getByText(
        `You received an invitation at ${mockEmail}. Complete your information below to continue.`
      )
    ).toBeTruthy();
  });

  it('renders login redirect footer', () => {
    render(<AcceptInviteForm />);
    expect(screen.getByTestId('login-redirect-footer')).toBeTruthy();
  });

  it('renders first name field', () => {
    render(<AcceptInviteForm />);
    expect(screen.getByLabelText(/First name/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your first name')).toBeTruthy();
  });

  it('renders last name field', () => {
    render(<AcceptInviteForm />);
    expect(screen.getByLabelText(/Last name/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your last name')).toBeTruthy();
  });

  it('renders password field', () => {
    render(<AcceptInviteForm />);
    expect(screen.getByLabelText(/Password(?! confirmation)/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Create a password')).toBeTruthy();
  });

  it('renders password confirmation field', () => {
    render(<AcceptInviteForm />);
    expect(screen.getByLabelText(/Password confirmation/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeTruthy();
  });

  it('renders error field if passwords do not match', async () => {
    render(<AcceptInviteForm />);
    await userEvent.type(screen.getByLabelText(/Password(?! confirmation)/), 'password1');
    await userEvent.type(screen.getByLabelText(/Password confirmation/), 'password2');
    expect(screen.getByText('Passwords do not match')).toBeTruthy();
  });

  it('renders error from accept invite API', () => {
    const mockError = {
      status: 400,
      data: {
        message: 'Error message',
      },
    };
    (useAcceptInviteMutation as jest.Mock).mockImplementation(() => [
      mockSubmitAcceptInvite,
      { error: mockError },
    ]);

    render(<AcceptInviteForm />);
    expect(screen.getByText(mockError.data.message)).toBeTruthy();
  });

  describe('submit', () => {
    it('does not submit API request if passwords do not match', async () => {
      render(<AcceptInviteForm />);
      await userEvent.type(screen.getByLabelText(/First name/), 'Andrew');
      await userEvent.type(screen.getByLabelText(/Last name/), 'Chang');
      await userEvent.type(screen.getByLabelText(/Password(?! confirmation)/), 'password1');
      await userEvent.type(screen.getByLabelText(/Password confirmation/), 'password2');
      await userEvent.click(screen.getByText('Continue'));
      expect(mockSubmitAcceptInvite).not.toHaveBeenCalled();
    });

    it('submits API request on button click', async () => {
      render(<AcceptInviteForm />);

      const mockFirstName = 'Andrew';
      const mockLastName = 'Change';
      const mockPassword = 'password';

      await userEvent.type(screen.getByLabelText(/First name/), mockFirstName);
      await userEvent.type(screen.getByLabelText(/Last name/), mockLastName);
      await userEvent.type(screen.getByLabelText(/Password(?! confirmation)/), mockPassword);
      await userEvent.type(screen.getByLabelText(/Password confirmation/), mockPassword);
      await userEvent.click(screen.getByText('Continue'));

      expect(mockSubmitAcceptInvite).toHaveBeenCalledWith({
        firstName: mockFirstName,
        lastName: mockLastName,
        password: mockPassword,
        inviteToken: mockInviteToken,
      });
    });
  });
});
