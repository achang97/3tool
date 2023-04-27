import { useAppSelector } from '@app/redux/hooks';
import { screen } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import { render } from '@tests/utils/renderWithContext';
import { Editor } from '../Editor';

jest.mock('../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
    updateTool: jest.fn(),
    evalDataMap: {},
    evalDataValuesMap: {},
    dataDepGraph: new DepGraph<string>(),
    dataDepCycles: {},
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useGetResourcesQuery: jest.fn(() => ({ data: [] })),
}));

describe('Editor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  describe('edit mode', () => {
    beforeEach(() => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        isPreview: false,
        resourceStack: [],
      }));
    });

    it('renders editor toolbar', () => {
      render(<Editor />);
      expect(screen.getByTestId('canvas-toolbar')).toBeTruthy();
    });

    it('renders editor sidebar', async () => {
      render(<Editor />);
      expect(screen.getByTestId('editor-sidebar')).toBeTruthy();
    });

    it('renders editor canvas', async () => {
      render(<Editor />);
      expect(screen.getByTestId('editor-canvas')).toBeTruthy();
    });

    it('renders editor actions', async () => {
      render(<Editor />);
      expect(screen.getByTestId('editor-actions')).toBeTruthy();
    });

    it('renders resource dialogs', async () => {
      render(<Editor />);
      expect(screen.getByTestId('resource-dialogs')).toBeTruthy();
    });
  });

  describe('preview mode', () => {
    beforeEach(() => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        isPreview: true,
        resourceStack: [],
      }));
    });

    it('renders editor toolbar', () => {
      render(<Editor />);
      expect(screen.getByTestId('canvas-toolbar')).toBeTruthy();
    });

    it('renders editor canvas', async () => {
      render(<Editor />);
      expect(screen.getByTestId('editor-canvas')).toBeTruthy();
    });

    it('does not render editor sidebar', () => {
      render(<Editor />);
      expect(screen.queryByTestId('editor-sidebar')).toBeNull();
    });

    it('does not render editor actions', () => {
      render(<Editor />);
      expect(screen.queryByTestId('editor-actions')).toBeNull();
    });

    it('does not render resource dialogs', () => {
      render(<Editor />);
      expect(screen.queryByTestId('resource-dialogs')).toBeNull();
    });
  });
});
