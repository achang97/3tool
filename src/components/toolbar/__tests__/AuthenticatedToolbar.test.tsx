import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { silenceConsoleError } from '@tests/utils/silenceConsoleError';
import { mockUser } from '@tests/constants/data';
import { AuthenticatedToolbar } from '../AuthenticatedToolbar';

const mockLogout = jest.fn();

jest.mock('@app/hooks/useUser', () => ({
  useUser: jest.fn(() => mockUser),
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
    const result = render(<AuthenticatedToolbar />);

    const avatar = result.getByTestId(avatarId);
    expect(avatar.textContent).toEqual(mockUser.firstName[0]);

    await userEvent.click(avatar);
    expect(await result.findByTestId('authenticated-toolbar-menu')).toBeTruthy();
  });

  it('renders link to Tools page', () => {
    const result = render(<AuthenticatedToolbar />);

    const toolsNav = result.getByText('Tools');
    expect(toolsNav.getAttribute('href')).toEqual('/');
  });

  it('renders link to Resources page', () => {
    const result = render(<AuthenticatedToolbar />);

    const resourcesNav = result.getByText('Resources');
    expect(resourcesNav.getAttribute('href')).toEqual('/resources');
  });

  it('renders link to Settings page', async () => {
    silenceConsoleError('inside a test was not wrapped in act(...)');

    const result = render(<AuthenticatedToolbar />);

    await userEvent.click(result.getByTestId(avatarId));

    const settingsNav = await result.findByTestId('authenticated-toolbar-settings');

    expect(settingsNav.getAttribute('href')).toEqual('/settings');
    expect(settingsNav).toHaveTextContent('Settings');
  });

  it('logs out the user and toggles dropdown menu', async () => {
    silenceConsoleError('inside a test was not wrapped in act(...)');

    const result = render(<AuthenticatedToolbar />);

    await userEvent.click(result.getByTestId(avatarId));

    const logoutButton = await result.findByText('Logout');
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    await waitFor(() => {
      expect(result.queryByText('Logout')).toBeNull();
    });
  });
});
