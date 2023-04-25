import Account from '@app/pages/settings/account';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';

describe('Account', () => {
  it('renders heading "Account information"', () => {
    render(<Account />);
    expect(screen.getByRole('heading', { name: /account information/i })).toBeVisible();
  });

  it('renders UpdateUserName', () => {
    render(<Account />);
    expect(screen.getByTestId('update-user-name')).toBeVisible();
  });
});
