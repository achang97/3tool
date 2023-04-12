import Login from '@app/pages/login';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';

describe('Login', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByTestId('login-form')).toBeTruthy();
  });
});
