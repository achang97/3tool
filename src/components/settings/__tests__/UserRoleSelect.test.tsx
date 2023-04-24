import { render } from '@tests/utils/renderWithContext';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Role } from '@app/types/users';
import { UserRoleSelect } from '../UserRoleSelect';

describe('UserRoleSelect', () => {
  it('renders UserRoleSelect with correct options', async () => {
    render(<UserRoleSelect value={Role.Viewer} />);

    const userRoleSelect = screen.getByRole('button');
    expect(userRoleSelect).toBeVisible();
    expect(userRoleSelect).toHaveTextContent(/viewer/i);

    await userEvent.click(userRoleSelect);

    expect(screen.getByRole('option', { name: /admin/i })).toBeVisible();
    expect(screen.getByRole('option', { name: /editor/i })).toBeVisible();
    expect(screen.getByRole('option', { name: /viewer/i })).toBeVisible();
  });

  it('calls onChange with the correct option when is clicked', async () => {
    const mockHandleChange = jest.fn();
    render(<UserRoleSelect value={Role.Viewer} onChange={mockHandleChange} />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('option', { name: /admin/i }));

    expect(mockHandleChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: { value: Role.Admin } }),
      expect.any(Object)
    );
  });
});
