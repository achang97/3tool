import { screen, render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useSignedInUser } from '@app/hooks/useSignedInUser';
import { mockUser } from '@tests/constants/data';
import { useGetMyUserQuery } from '@app/redux/services/users';
import { useRouteChangeListener } from '@app/hooks/useRouteChangeListener';
import { AuthRedirectProvider } from '../AuthRedirectProvider';

const mockChildren = 'children';
const mockPush = jest.fn();

jest.mock('@app/hooks/useSignedInUser');

jest.mock('@app/hooks/useRouteChangeListener');

jest.mock('@app/redux/services/users', () => ({
  useGetMyUserQuery: jest.fn(),
}));

describe('AuthRedirectProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '',
      push: mockPush,
    }));
  });

  it('refreshes user', () => {
    render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);
    expect(useGetMyUserQuery).toHaveBeenCalled();
  });

  it('listens for route changes', () => {
    render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);
    expect(useRouteChangeListener).toHaveBeenCalled();
  });

  describe('authenticated', () => {
    beforeEach(() => {
      (useSignedInUser as jest.Mock).mockImplementation(() => mockUser);
    });

    it('renders children if on authed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/resources',
        push: mockPush,
      }));

      render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(screen.getByText(mockChildren)).toBeTruthy();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('renders loader and redirects to / if on unauthed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/login',
        push: mockPush,
      }));

      render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(screen.getByTestId('fullscreen-loader')).toBeTruthy();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      (useSignedInUser as jest.Mock).mockImplementation(() => undefined);
    });

    it('renders children if on unauthed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/login',
        push: mockPush,
      }));

      render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(screen.getByText(mockChildren)).toBeTruthy();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('renders loader and redirects to /login if on authed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/resources',
        push: mockPush,
      }));

      render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(screen.getByTestId('fullscreen-loader')).toBeTruthy();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
