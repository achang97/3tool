import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useUser } from '@app/hooks/useUser';
import { mockUser } from '@tests/constants/data';
import { useGetMyUserQuery } from '@app/redux/services/users';
import { AuthRedirectProvider } from '../AuthRedirectProvider';

const mockChildren = 'children';
const mockPush = jest.fn();

jest.mock('@app/hooks/useUser');

jest.mock('@app/redux/services/users', () => ({
  useGetMyUserQuery: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
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

  describe('authenticated', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockImplementation(() => mockUser);
    });

    it('renders children if on authed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/resources',
        push: mockPush,
      }));

      const result = render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(result.getByText(mockChildren)).toBeTruthy();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('renders loader and redirects to / if on unauthed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/login',
        push: mockPush,
      }));

      const result = render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(result.getByTestId('fullscreen-loader')).toBeTruthy();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('unauthenticated', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockImplementation(() => undefined);
    });

    it('renders children if on unauthed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/login',
        push: mockPush,
      }));

      const result = render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(result.getByText(mockChildren)).toBeTruthy();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('renders loader and redirects to /login if on authed route', () => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        pathname: '/resources',
        push: mockPush,
      }));

      const result = render(<AuthRedirectProvider>{mockChildren}</AuthRedirectProvider>);

      expect(result.getByTestId('fullscreen-loader')).toBeTruthy();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
