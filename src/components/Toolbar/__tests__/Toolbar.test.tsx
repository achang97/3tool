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
  const toolViewerToolbarId = 'tool-viewer-toolbar';
  const toolEditorToolbarId = 'tool-editor-toolbar';

  it('renders nothing if user is unauthenticated', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: false,
    }));

    const result = render(<Toolbar />);
    expect(result.queryByTestId(generalToolbarId)).toBeNull();
    expect(result.queryByTestId(toolViewerToolbarId)).toBeNull();
    expect(result.queryByTestId(toolEditorToolbarId)).toBeNull();
  });

  it('renders Tool Viewer toolbar if on /tools/[id] route', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: true,
    }));
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/tools/[id]',
    }));

    const result = render(<Toolbar />);
    expect(result.getByTestId(toolViewerToolbarId)).toBeDefined();
  });

  it('renders Tool Editor toolbar if on /editor/[id] route', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: true,
    }));
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/editor/[id]',
    }));

    const result = render(<Toolbar />);
    expect(result.getByTestId(toolEditorToolbarId)).toBeDefined();
  });

  it('renders general toolbar in the default case', () => {
    (useAuth0 as jest.Mock).mockImplementation(() => ({
      isAuthenticated: true,
    }));
    (useRouter as jest.Mock).mockImplementation(() => ({
      pathname: '/',
    }));

    const result = render(<Toolbar />);
    expect(result.getByTestId(generalToolbarId)).toBeDefined();
  });
});
