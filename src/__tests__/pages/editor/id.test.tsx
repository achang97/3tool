import { useQueryTool } from '@app/components/editor/hooks/useQueryTool';
import Editor from '@app/pages/editor/[id]';
import { mockTool } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { resetActiveTool } from '@app/redux/features/activeToolSlice';
import { resetEditor } from '@app/redux/features/editorSlice';

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

describe('Editor/Id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears state on unmount', () => {
    const result = render(<Editor />);
    result.unmount();
    expect(mockDispatch).toHaveBeenCalledWith(resetEditor());
    expect(mockDispatch).toHaveBeenCalledWith(resetActiveTool());
  });

  describe('loading', () => {
    it('renders fullscreen loader', () => {
      (useQueryTool as jest.Mock).mockImplementation(() => undefined);
      render(<Editor />);
      expect(screen.getByTestId('fullscreen-loader')).toBeTruthy();
    });
  });

  describe('fulfilled', () => {
    beforeEach(() => {
      (useQueryTool as jest.Mock).mockImplementation(() => mockTool);
    });

    it('renders tool editor toolbar', () => {
      render(<Editor />);
      expect(screen.getByTestId('tool-editor-toolbar')).toBeTruthy();
    });

    it('renders editor', () => {
      render(<Editor />);
      expect(screen.getByTestId('editor')).toBeTruthy();
    });
  });
});
