import { useRouter } from 'next/router';
import { render } from '@tests/utils/renderWithContext';
import { useUser } from '@app/hooks/useUser';
import { mockUser } from '@tests/constants/data';
import { Toolbar } from '../Toolbar';

jest.mock('@app/hooks/useUser');

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '',
  })),
}));

describe('Toolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders unauthenticated toolbar', () => {
    (useUser as jest.Mock).mockImplementation(() => undefined);

    const result = render(<Toolbar />);
    expect(result.getByTestId('unauthenticated-toolbar')).toBeTruthy();
  });

  it('renders nothing if on /tools/[id] route', () => {
    (useUser as jest.Mock).mockImplementation(() => mockUser);
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/tools/[id]',
    }));

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders nothing if on /editor/[id] route', () => {
    (useUser as jest.Mock).mockImplementation(() => mockUser);
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/editor/[id]',
      query: {},
    }));

    const result = render(<Toolbar />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders general toolbar in the default case', () => {
    (useUser as jest.Mock).mockImplementation(() => mockUser);
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/',
    }));

    const result = render(<Toolbar />);
    expect(result.getByTestId('authenticated-toolbar')).toBeTruthy();
  });
});
