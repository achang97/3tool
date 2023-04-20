import ResetPassword from '@app/pages/resetPassword';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';

describe('Reset Password', () => {
  it('renders reset password form', () => {
    render(<ResetPassword />);
    expect(screen.getByTestId('reset-password-form')).toBeTruthy();
  });
});
