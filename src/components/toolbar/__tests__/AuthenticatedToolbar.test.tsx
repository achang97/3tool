import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { silenceConsoleError } from '@tests/utils/silenceConsoleError';
import { mockUser } from '@tests/constants/data';
import { AuthenticatedToolbar } from '../AuthenticatedToolbar';

const mockLogout = jest.fn();

jest.mock('@app/hooks/useSignedInUser', () => ({
  useSignedInUser: jest.fn(() => mockUser),
}));

jest.mock('@app/hooks/useLogout', () => ({
  useLogout: jest.fn(() => mockLogout),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
  }),
}));

describe('AuthenticatedToolbar', () => {
  const avatarId = 'authenticated-toolbar-avatar';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user avatar to open the menu', async () => {
    render(<AuthenticatedToolbar />);

    const avatar = screen.getByTestId(avatarId);
    expect(avatar.textContent).toEqual(mockUser.firstName[0]);

    await userEvent.click(avatar);
    expect(await screen.findByTestId('authenticated-toolbar-menu')).toBeTruthy();
  });

  it('renders link to Apps page', () => {
    render(<AuthenticatedToolbar />);

    const appsNav = screen.getByText('Apps');
    expect(appsNav.getAttribute('href')).toEqual('/');
  });

  it('renders link to Resources page', () => {
    render(<AuthenticatedToolbar />);

    const resourcesNav = screen.getByText('Resources');
    expect(resourcesNav.getAttribute('href')).toEqual('/resources');
  });

  it('renders link to Settings page', async () => {
    silenceConsoleError('inside a test was not wrapped in act(...)');

    render(<AuthenticatedToolbar />);

    await userEvent.click(screen.getByTestId(avatarId));

    const settingsNav = await screen.findByTestId('authenticated-toolbar-settings');

    expect(settingsNav.getAttribute('href')).toEqual('/settings/team');
    expect(settingsNav).toHaveTextContent('Settings');
  });

  it('logs out the user and toggles dropdown menu', async () => {
    silenceConsoleError('inside a test was not wrapped in act(...)');

    render(<AuthenticatedToolbar />);

    await userEvent.click(screen.getByTestId(avatarId));

    const logoutButton = await screen.findByText('Logout');
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText('Logout')).toBeNull();
    });
  });
});
