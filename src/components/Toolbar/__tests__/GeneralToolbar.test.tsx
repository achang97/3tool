import userEvent from '@testing-library/user-event';
import { act, waitFor } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { silenceConsoleError } from '@tests/utils/silenceConsoleError';
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

  it('renders user avatar to open the menu', async () => {
    const result = render(<GeneralToolbar />);

    const avatar = result.getByTestId(avatarId);
    expect(avatar.textContent).toEqual(mockUser.name[0]);

    userEvent.click(avatar);
    expect(await result.findByTestId('general-toolbar-menu')).toBeDefined();
  });

  it('renders link to Tools page', () => {
    const result = render(<GeneralToolbar />);

    const toolsNav = result.getByText('Tools');
    expect(toolsNav.getAttribute('href')).toEqual('/');
  });

  it('renders link to Resources page', () => {
    const result = render(<GeneralToolbar />);

    const resourcesNav = result.getByText('Resources');
    expect(resourcesNav.getAttribute('href')).toEqual('/resources');
  });

  it('renders link to Settings page', async () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://example.com'),
      configurable: true,
    });

    silenceConsoleError('inside a test was not wrapped in act(...)');

    const result = render(<GeneralToolbar />);

    userEvent.click(result.getByTestId(avatarId));

    const settingsNav = await result.findByText('Settings');
    expect(settingsNav.getAttribute('href')).toEqual('/settings');
  });

  it('logs out the user and toggles dropdown menu', async () => {
    silenceConsoleError('inside a test was not wrapped in act(...)');

    const result = render(<GeneralToolbar />);

    userEvent.click(result.getByTestId(avatarId));

    const logoutButton = await result.findByText('Logout');
    userEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(result.queryByText('Logout')).toBeNull();
    });
  });
});
