import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { render } from '@tests/utils/renderWithContext';
import { silenceConsoleError } from '@tests/utils/silenceConsoleError';
import { DefaultToolbar } from '../DefaultToolbar';

const mockLogout = jest.fn();
const mockUser = { name: 'Andrew' };

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    logout: mockLogout,
    user: mockUser,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
  }),
}));

describe('DefaultToolbar', () => {
  const avatarId = 'default-toolbar-avatar';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user avatar to open the menu', async () => {
    const result = render(<DefaultToolbar />);

    const avatar = result.getByTestId(avatarId);
    expect(avatar.textContent).toEqual(mockUser.name[0]);

    await userEvent.click(avatar);
    expect(await result.findByTestId('default-toolbar-menu')).toBeTruthy();
  });

  it('renders link to Tools page', () => {
    const result = render(<DefaultToolbar />);

    const toolsNav = result.getByText('Tools');
    expect(toolsNav.getAttribute('href')).toEqual('/');
  });

  it('renders link to Resources page', () => {
    const result = render(<DefaultToolbar />);

    const resourcesNav = result.getByText('Resources');
    expect(resourcesNav.getAttribute('href')).toEqual('/resources');
  });

  it('renders link to Settings page', async () => {
    silenceConsoleError('inside a test was not wrapped in act(...)');

    const result = render(<DefaultToolbar />);

    await userEvent.click(result.getByTestId(avatarId));

    const settingsNav = await result.findByTestId('default-toolbar-settings');

    expect(settingsNav.getAttribute('href')).toEqual('/settings');
    expect(settingsNav).toHaveTextContent('Settings');
  });

  it('logs out the user and toggles dropdown menu', async () => {
    silenceConsoleError('inside a test was not wrapped in act(...)');

    const result = render(<DefaultToolbar />);

    await userEvent.click(result.getByTestId(avatarId));

    const logoutButton = await result.findByText('Logout');
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledWith({ returnTo: BASE_WINDOW_URL });
    await waitFor(() => {
      expect(result.queryByText('Logout')).toBeNull();
    });
  });
});
