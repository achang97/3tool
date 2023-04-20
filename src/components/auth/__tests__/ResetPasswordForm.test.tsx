import { screen, render } from '@testing-library/react';
import { useApplyForgotPasswordMutation } from '@app/redux/services/auth';
import userEvent from '@testing-library/user-event';
import { ResetPasswordForm } from '../ResetPasswordForm';

const mockSubmitResetPassword = jest.fn();

const mockForgotPasswordToken = 'forgotPasswordToken';

jest.mock('@app/redux/services/auth', () => ({
  useApplyForgotPasswordMutation: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { forgotPasswordToken: mockForgotPasswordToken },
  })),
}));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useApplyForgotPasswordMutation as jest.Mock).mockImplementation(() => [
      mockSubmitResetPassword,
      {},
    ]);
  });

  it('renders title', () => {
    render(<ResetPasswordForm />);
    expect(screen.getByText('Set your new password')).toBeTruthy();
  });

  it('renders password field', () => {
    render(<ResetPasswordForm />);
    expect(screen.getByLabelText(/Password(?! confirmation)/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Create a password')).toBeTruthy();
  });

  it('renders password confirmation field', () => {
    render(<ResetPasswordForm />);
    expect(screen.getByLabelText(/Password confirmation/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeTruthy();
  });

  it('renders error field if passwords do not match', async () => {
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/Password(?! confirmation)/), 'password1');
    await userEvent.type(screen.getByLabelText(/Password confirmation/), 'password2');
    expect(screen.getByText('Passwords do not match')).toBeTruthy();
  });

  it('renders error from reset password API', () => {
    const mockError = {
      status: 400,
      data: {
        message: 'Error message',
      },
    };
    (useApplyForgotPasswordMutation as jest.Mock).mockImplementation(() => [
      mockSubmitResetPassword,
      { error: mockError },
    ]);

    render(<ResetPasswordForm />);
    expect(screen.getByText(mockError.data.message)).toBeTruthy();
  });

  describe('submit', () => {
    it('does not submit API request if passwords do not match', async () => {
      render(<ResetPasswordForm />);
      await userEvent.type(screen.getByLabelText(/Password(?! confirmation)/), 'password1');
      await userEvent.type(screen.getByLabelText(/Password confirmation/), 'password2');
      await userEvent.click(screen.getByText('Set password'));
      expect(mockSubmitResetPassword).not.toHaveBeenCalled();
    });

    it('submits API request on button click', async () => {
      render(<ResetPasswordForm />);

      const mockPassword = 'password';
      await userEvent.type(screen.getByLabelText(/Password(?! confirmation)/), mockPassword);
      await userEvent.type(screen.getByLabelText(/Password confirmation/), mockPassword);
      await userEvent.click(screen.getByText('Set password'));

      expect(mockSubmitResetPassword).toHaveBeenCalledWith({
        password: mockPassword,
        forgotPasswordToken: mockForgotPasswordToken,
      });
    });
  });
});
