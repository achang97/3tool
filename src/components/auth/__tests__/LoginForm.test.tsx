import { render } from '@testing-library/react';
import { useLoginMutation } from '@app/redux/services/auth';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

const mockLogin = jest.fn();

jest.mock('@app/redux/services/auth', () => ({
  useLoginMutation: jest.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLoginMutation as jest.Mock).mockImplementation(() => [mockLogin, {}]);
  });

  it('renders email field', () => {
    const result = render(<LoginForm />);
    expect(result.getByLabelText(/Email/)).toBeTruthy();
    expect(result.getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('renders password field', () => {
    const result = render(<LoginForm />);
    expect(result.getByLabelText(/Password/)).toBeTruthy();
    expect(result.getByPlaceholderText('Enter password')).toBeTruthy();
  });

  it('renders error from login API', () => {
    const mockError = {
      status: 400,
      data: {
        message: 'Error message',
      },
    };
    (useLoginMutation as jest.Mock).mockImplementation(() => [
      mockLogin,
      { error: mockError },
    ]);

    const result = render(<LoginForm />);
    expect(result.getByText(mockError.data.message)).toBeTruthy();
  });

  describe('submit', () => {
    it('does not login if email is not given', async () => {
      const result = render(<LoginForm />);

      await userEvent.type(result.getByLabelText(/Password/), 'password');
      await userEvent.click(result.getByText('Login'));

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('does not login if password is not given', async () => {
      const result = render(<LoginForm />);

      await userEvent.type(result.getByLabelText(/Email/), 'email');
      await userEvent.click(result.getByText('Login'));

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('logs in with email and password on button click', async () => {
      const mockEmail = 'andrew@tryelixir.io';
      const mockPassword = 'password';

      const result = render(<LoginForm />);

      await userEvent.type(result.getByLabelText(/Email/), mockEmail);
      await userEvent.type(result.getByLabelText(/Password/), mockPassword);
      await userEvent.click(result.getByText('Login'));

      expect(mockLogin).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockPassword,
      });
    });
  });
});
