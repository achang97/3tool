import { useAppSelector } from '@app/redux/hooks';
import { render } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
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

jest.mock('../hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => jest.fn()),
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
      }));
    });

    it('renders editor toolbar', () => {
      const result = render(<Editor />);
      expect(result.getByTestId('canvas-toolbar')).toBeTruthy();
    });

    it('renders editor sidebar', async () => {
      const result = render(<Editor />);
      expect(result.getByTestId('editor-sidebar')).toBeTruthy();
    });

    it('renders editor canvas', async () => {
      const result = render(<Editor />);
      expect(result.getByTestId('editor-canvas')).toBeTruthy();
    });

    it('renders editor actions', async () => {
      const result = render(<Editor />);
      expect(result.getByTestId('editor-actions')).toBeTruthy();
    });
  });

  describe('preview mode', () => {
    beforeEach(() => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        isPreview: true,
      }));
    });

    it('renders editor toolbar', () => {
      const result = render(<Editor />);
      expect(result.getByTestId('canvas-toolbar')).toBeTruthy();
    });

    it('renders editor canvas', async () => {
      const result = render(<Editor />);
      expect(result.getByTestId('editor-canvas')).toBeTruthy();
    });

    it('does not render editor sidebar', () => {
      const result = render(<Editor />);
      expect(result.queryByTestId('editor-sidebar')).toBeNull();
    });

    it('does not render editor actions', () => {
      const result = render(<Editor />);
      expect(result.queryByTestId('editor-actions')).toBeNull();
    });
  });
});
