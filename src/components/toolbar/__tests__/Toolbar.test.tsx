import { useRouter } from 'next/router';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { useSignedInUser } from '@app/hooks/useSignedInUser';
import { mockUser } from '@tests/constants/data';
import { Toolbar } from '../Toolbar';

jest.mock('@app/hooks/useSignedInUser');

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '',
  })),
}));

describe('Toolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if not logged in', () => {
    (useSignedInUser as jest.Mock).mockImplementation(() => undefined);

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders nothing if on /tools/[id]/[name] route', () => {
    (useSignedInUser as jest.Mock).mockImplementation(() => mockUser);
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/tools/[id]/[name]',
    }));

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders nothing if on /editor/[id]/[name] route', () => {
    (useSignedInUser as jest.Mock).mockImplementation(() => mockUser);
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/editor/[id]/[name]',
      query: {},
    }));

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders general toolbar in the default case', () => {
    (useSignedInUser as jest.Mock).mockImplementation(() => mockUser);
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/',
    }));

    render(<Toolbar />);
    expect(screen.getByTestId('authenticated-toolbar')).toBeTruthy();
  });
});
