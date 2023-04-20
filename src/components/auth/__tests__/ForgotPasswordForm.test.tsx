import { screen, render } from '@testing-library/react';
import { useForgotPasswordMutation } from '@app/redux/services/auth';
import userEvent from '@testing-library/user-event';
import { mockApiErrorResponse, mockApiSuccessResponse } from '@tests/constants/api';
import { ForgotPasswordForm } from '../ForgotPasswordForm';

const mockSubmitForgotPassword = jest.fn();
const mockEnqueueSnackbar = jest.fn();

jest.mock('@app/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('@app/redux/services/auth', () => ({
  useForgotPasswordMutation: jest.fn(),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useForgotPasswordMutation as jest.Mock).mockImplementation(() => [
      mockSubmitForgotPassword,
      {},
    ]);
  });

  it('renders title', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText('Reset your password')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByText('Enter your email to receive a link to reset your password.')
    ).toBeTruthy();
  });

  it('renders login redirect footer', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByTestId('login-redirect-footer')).toBeTruthy();
  });

  it('renders email field', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText(/Your email/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('renders error from forgot password API', () => {
    const mockError = {
      status: 400,
      data: {
        message: 'Error message',
      },
    };
    (useForgotPasswordMutation as jest.Mock).mockImplementation(() => [
      mockSubmitForgotPassword,
      { error: mockError },
    ]);

    render(<ForgotPasswordForm />);
    expect(screen.getByText(mockError.data.message)).toBeTruthy();
  });

  describe('submit', () => {
    it('submits API request on button click', async () => {
      render(<ForgotPasswordForm />);

      const mockEmail = 'andrew@tryelixir.io';
      await userEvent.type(screen.getByLabelText(/Your email/), mockEmail);
      await userEvent.click(screen.getByText('Continue'));

      expect(mockSubmitForgotPassword).toHaveBeenCalledWith({
        email: mockEmail,
      });
    });

    it('shows success snackbar if API request succeeds', async () => {
      mockSubmitForgotPassword.mockImplementation(() => mockApiSuccessResponse);
      render(<ForgotPasswordForm />);

      const mockEmail = 'andrew@tryelixir.io';
      await userEvent.type(screen.getByLabelText(/Your email/), mockEmail);
      await userEvent.click(screen.getByText('Continue'));

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(`Sent an email to ${mockEmail}`, {
        variant: 'success',
      });
    });

    it('does not show success snackbar if API request fails', async () => {
      mockSubmitForgotPassword.mockImplementation(() => mockApiErrorResponse);
      render(<ForgotPasswordForm />);

      const mockEmail = 'andrew@tryelixir.io';
      await userEvent.type(screen.getByLabelText(/Your email/), mockEmail);
      await userEvent.click(screen.getByText('Continue'));

      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });
  });
});
