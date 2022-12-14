import React from 'react';
import { render } from 'tests/utils/renderWithContext';
import { useAuth0 } from '@auth0/auth0-react';
import { Router } from '../Router';

jest.mock('@auth0/auth0-react');

const mockLoginWithRedirect = jest.fn();

describe('Router', () => {
  const loaderId = 'fullscreen-loader';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      loginWithRedirect: mockLoginWithRedirect,
    }));
  });

  describe('Authenticated', () => {
    beforeEach(() => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isAuthenticated: true,
        loginWithRedirect: mockLoginWithRedirect,
      }));
    });

    it('renders the Tools page for the / route', async () => {
      window.history.pushState('', '', '/');

      const result = render(<Router />);

      expect(result.findByTestId('tools')).toBeDefined();
    });

    it('renders the Resources page for the /resources route', async () => {
      window.history.pushState('', '', '/resources');

      const result = render(<Router />);

      expect(result.findByTestId('resources')).toBeDefined();
    });

    it('renders the Resource Settings page for the /resources/:resourceId route', async () => {
      window.history.pushState('', '', '/resources/123');

      const result = render(<Router />);

      expect(result.findByTestId('resource-settings')).toBeDefined();
    });

    it('renders the Tool Editor page for the /editor/:toolId route', async () => {
      window.history.pushState('', '', '/editor/123');

      const result = render(<Router />);

      expect(result.findByTestId('tool-editor')).toBeDefined();
    });

    it('renders the Tool viewer page for the /tools/:toolId route', async () => {
      window.history.pushState('', '', '/tools/123');

      const result = render(<Router />);

      expect(result.findByTestId('tool-viewer')).toBeDefined();
    });

    it('renders the Settings page for the /settings/:sectionId route', async () => {
      window.history.pushState('', '', '/settings/123');

      const result = render(<Router />);

      expect(result.findByTestId('settings')).toBeDefined();
    });

    it('redirects to the Tools page for unsupported route', async () => {
      window.history.pushState('', '', '/asdf');

      const result = render(<Router />);

      expect(result.findByTestId('settings')).toBeDefined();
    });
  });

  describe('Unauthenticated', () => {
    it('displays a loader for all routes', async () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isAuthenticated: false,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      const result = render(<Router />);

      expect(result.findByTestId(loaderId)).toBeDefined();
    });
  });

  describe('Login', () => {
    it('does not redirect if still loading user information', () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isLoading: true,
        isAuthenticated: false,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      render(<Router />);

      expect(mockLoginWithRedirect).not.toHaveBeenCalled();
    });

    it('does not redirect if user is already authenticated', () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isLoading: false,
        isAuthenticated: true,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      render(<Router />);

      expect(mockLoginWithRedirect).not.toHaveBeenCalled();
    });

    it('redirects if user is not authenticated', async () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isLoading: false,
        isAuthenticated: false,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      render(<Router />);

      expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
