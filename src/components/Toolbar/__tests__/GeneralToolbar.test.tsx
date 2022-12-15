import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { render } from 'tests/utils/renderWithContext';
import { GeneralToolbar } from '../GeneralToolbar';

const mockLogout = jest.fn();
const mockUser = { name: 'Andrew' };

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    logout: mockLogout,
    user: mockUser,
  }),
}));

describe('GeneralToolbar', () => {
  const avatarId = 'general-toolbar-avatar';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays user avatar to open the menu', async () => {
    const result = render(<GeneralToolbar />);

    const avatar = result.getByTestId(avatarId);
    expect(avatar.textContent).toEqual(mockUser.name[0]);

    userEvent.click(avatar);
    expect(await result.findByTestId('general-toolbar-menu')).toBeDefined();
  });

  it('navigates to Tools page', () => {
    const result = render(<GeneralToolbar />);

    const toolsNav = result.getByText('Tools');
    userEvent.click(toolsNav);

    expect(window.location.pathname).toEqual('/');
  });

  it('navigates to Resources page', () => {
    const result = render(<GeneralToolbar />);

    const resourcesNav = result.getByText('Resources');
    userEvent.click(resourcesNav);

    expect(window.location.pathname).toEqual('/resources');
  });

  it('navigates to Settings page and toggles dropdown menu', async () => {
    const result = render(<GeneralToolbar />);

    userEvent.click(result.getByTestId(avatarId));

    const settingsNav = await result.findByText('Settings');
    userEvent.click(settingsNav);

    expect(window.location.pathname).toEqual('/settings');
    await waitFor(() => {
      expect(result.queryByText('Settings')).toBeNull();
    });
  });

  it('logs out the user and toggles dropdown menu', async () => {
    const result = render(<GeneralToolbar />);

    userEvent.click(result.getByTestId(avatarId));

    const logoutButton = await result.findByText('Logout');
    userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.queryByText('Logout')).toBeNull();
    });
  });
});
