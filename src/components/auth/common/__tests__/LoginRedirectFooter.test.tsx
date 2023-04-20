import { render, screen } from '@testing-library/react';
import { LoginRedirectFooter } from '../LoginRedirectFooter';

describe('LoginRedirectFooter', () => {
  it('renders text', () => {
    render(<LoginRedirectFooter />);
    expect(screen.getByTestId('login-redirect-footer')).toHaveTextContent(
      'Or sign in if you already have an account.'
    );
  });

  it('renders link to /login', () => {
    render(<LoginRedirectFooter />);
    expect(screen.getByText('sign in')).toHaveAttribute('href', '/login');
  });
});
