import { useAuth0 } from '@auth0/auth0-react';
import { render } from '@testing-library/react';
import { Auth0RedirectWrapper } from '../Auth0RedirectWrapper';

jest.mock('@auth0/auth0-react');

const mockChildren = 'children';
const mockLoginWithRedirect = jest.fn();

describe('Auth0RedirectWrapper', () => {
  const loaderId = 'fullscreen-loader';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loader if loading', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isLoading: true,
      isAuthenticated: true,
    }));
    const result = render(
      <Auth0RedirectWrapper>{mockChildren}</Auth0RedirectWrapper>
    );
    expect(result.getByTestId(loaderId)).toBeDefined();
  });

  it('renders loader if not authenticated', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    }));
    const result = render(
      <Auth0RedirectWrapper>{mockChildren}</Auth0RedirectWrapper>
    );
    expect(result.getByTestId(loaderId)).toBeDefined();
  });

  it('renders children if not loading and authenticated', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      isAuthenticated: true,
    }));
    const result = render(
      <Auth0RedirectWrapper>{mockChildren}</Auth0RedirectWrapper>
    );
    expect(result.queryByTestId(loaderId)).toBeNull();
    expect(result.getByText(mockChildren)).toBeDefined();
  });

  it('redirects to Auth0 login if not loading and unauthenticated', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    }));
    render(<Auth0RedirectWrapper>{mockChildren}</Auth0RedirectWrapper>);
    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({
      redirectUri: 'http://localhost',
    });
  });
});
