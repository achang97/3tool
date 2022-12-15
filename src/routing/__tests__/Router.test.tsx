import React from 'react';
import { render } from 'tests/utils/renderWithContext';
import { useAuth0 } from '@auth0/auth0-react';
import { Router } from '../Router';

jest.mock('@auth0/auth0-react');

const mockLoginWithRedirect = jest.fn();

describe('Router', () => {
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

    it('renders the Tools page for the / route', () => {
      window.history.pushState('', '', '/');

      const result = render(<Router />, { router: false });

      expect(result.getByTestId('tools')).toBeDefined();
    });

    it('renders the Resources page for the /resources route', () => {
      window.history.pushState('', '', '/resources');

      const result = render(<Router />, { router: false });

      expect(result.getByTestId('resources')).toBeDefined();
    });

    it('renders the Resource Settings page for the /resources/:resourceId route', () => {
      window.history.pushState('', '', '/resources/123');

      const result = render(<Router />, { router: false });

      expect(result.getByTestId('resource-settings')).toBeDefined();
    });

    it('renders the Tool Editor page for the /editor/:toolId route', () => {
      window.history.pushState('', '', '/editor/123');

      const result = render(<Router />, { router: false });

      expect(result.getByTestId('tool-editor')).toBeDefined();
    });

    it('renders the Tool viewer page for the /tools/:toolId route', () => {
      window.history.pushState('', '', '/tools/123');

      const result = render(<Router />, { router: false });

      expect(result.getByTestId('tool-viewer')).toBeDefined();
    });

    it('renders the Settings page for the /settings route', () => {
      window.history.pushState('', '', '/settings');

      const result = render(<Router />, { router: false });

      expect(result.getByTestId('settings')).toBeDefined();
    });

    it('renders Error 404 page for unsupported route', async () => {
      window.history.pushState('', '', '/asdf');

      const result = render(<Router />, { router: false });

      expect(await result.findByTestId('error-404')).toBeDefined();
    });
  });

  describe('Unauthenticated', () => {
    it('displays a loader for all routes', () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isAuthenticated: false,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      const result = render(<Router />, { router: false });

      expect(result.getByTestId('fullscreen-loader')).toBeDefined();
    });
  });

  describe('Login', () => {
    it('does not redirect if still loading user information', () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isLoading: true,
        isAuthenticated: false,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      render(<Router />, { router: false });

      expect(mockLoginWithRedirect).not.toHaveBeenCalled();
    });

    it('does not redirect if user is already authenticated', () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isLoading: false,
        isAuthenticated: true,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      render(<Router />, { router: false });

      expect(mockLoginWithRedirect).not.toHaveBeenCalled();
    });

    it('redirects if user is not authenticated', async () => {
      (useAuth0 as jest.Mock).mockImplementation(() => ({
        isLoading: false,
        isAuthenticated: false,
        loginWithRedirect: mockLoginWithRedirect,
      }));

      render(<Router />, { router: false });

      expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
