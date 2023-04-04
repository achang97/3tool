import Login from '@app/pages/login';
import { render } from '@tests/utils/renderWithContext';

describe('Login', () => {
  it('renders login form', () => {
    const result = render(<Login />);
    expect(result.getByTestId('login-form')).toBeTruthy();
  });
});
