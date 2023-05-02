import { useQueryTool } from '@app/components/editor/hooks/useQueryTool';
import App from '@app/pages/apps/[id]/[name]';
import { mockTool } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { resetActiveTool } from '@app/redux/features/activeToolSlice';

const mockDispatch = jest.fn();

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  __esModule: true,
  useGetResourcesQuery: jest.fn(() => ({ data: [] })),
}));

jest.mock('@app/redux/services/tools', () => ({
  ...jest.requireActual('@app/redux/services/tools'),
  __esModule: true,
  useGetToolByIdQuery: jest.fn(() => ({
    data: mockTool,
  })),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { id: mockTool._id },
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  ...jest.requireActual('@app/redux/hooks'),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/components/editor/hooks/useQueryTool');

describe('Apps/Id/Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears state on unmount', () => {
    const result = render(<App />);
    result.unmount();
    expect(mockDispatch).toHaveBeenCalledWith(resetActiveTool());
  });

  describe('loading', () => {
    it('renders fullscreen loader', () => {
      (useQueryTool as jest.Mock).mockImplementation(() => undefined);
      render(<App />);
      expect(screen.getByTestId('fullscreen-loader')).toBeTruthy();
    });
  });

  describe('fulfilled', () => {
    beforeEach(() => {
      (useQueryTool as jest.Mock).mockImplementation(() => mockTool);
    });

    it('renders tool viewer toolbar', () => {
      render(<App />);
      expect(screen.getByTestId('tool-viewer-toolbar')).toBeTruthy();
    });

    it('renders editor app', () => {
      render(<App />);
      expect(screen.getByTestId('editor-app')).toBeTruthy();
    });
  });
});
