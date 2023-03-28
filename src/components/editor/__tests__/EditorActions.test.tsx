import { useAppSelector } from '@app/redux/hooks';
import { render } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import {
  EditorActions,
  MAXIMIZED_HEIGHT,
  MINIMIZED_HEIGHT,
} from '../EditorActions';

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

describe('EditorActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('renders action list', () => {
    const result = render(<EditorActions />);
    expect(result.getByTestId('action-list')).toBeTruthy();
  });

  it('renders placeholder if no action is focused', () => {
    const result = render(<EditorActions />);
    expect(result.getByTestId('action-editor-placeholder')).toBeTruthy();
  });

  it('renders action editor if action is focused', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedAction: mockTool.actions[0],
    }));
    const result = render(<EditorActions />);
    expect(result.getByTestId('action-editor')).toBeTruthy();
  });

  describe('height', () => {
    it('renders with minimized height', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        isActionViewMaximized: false,
      }));
      const result = render(<EditorActions />);
      expect(
        getComputedStyle(result.container.firstChild as Element).height
      ).toEqual(MINIMIZED_HEIGHT);
    });

    it('renders with maximized height', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        isActionViewMaximized: true,
      }));
      const result = render(<EditorActions />);
      expect(
        getComputedStyle(result.container.firstChild as Element).height
      ).toEqual(MAXIMIZED_HEIGHT);
    });
  });
});
