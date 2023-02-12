import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { render } from '@tests/utils/renderWithContext';
import { Toolbar } from '../Toolbar';

jest.mock('@auth0/auth0-react');

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '',
  })),
}));

describe('Toolbar', () => {
  const generalToolbarId = 'general-toolbar';

  it('renders nothing if user is unauthenticated', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: false,
    }));

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders nothing if on /tools/[id] route', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: true,
    }));
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/tools/[id]',
    }));

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders nothing if on /editor/[id] route', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: true,
    }));
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/editor/[id]',
      query: {},
    }));

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders general toolbar in the default case', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: true,
    }));
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/',
    }));

    const result = render(<Toolbar />);
    expect(result.getByTestId(generalToolbarId)).toBeTruthy();
  });
});
