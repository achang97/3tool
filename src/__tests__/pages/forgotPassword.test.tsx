import ForgotPassword from '@app/pages/forgotPassword';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';

describe('Forgot Password', () => {
  it('renders forgot password form', () => {
    render(<ForgotPassword />);
    expect(screen.getByTestId('forgot-password-form')).toBeTruthy();
  });
});
