import { useAppSelector } from '@app/redux/hooks';
import { screen } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import { render } from '@tests/utils/renderWithContext';
import { EditorActions } from '../EditorActions';

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

describe('EditorActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('renders action list', () => {
    render(<EditorActions />);
    expect(screen.getByTestId('action-list')).toBeTruthy();
  });

  it('renders placeholder if no action is focused', () => {
    render(<EditorActions />);
    expect(screen.getByTestId('action-editor-placeholder')).toBeTruthy();
  });

  it('renders action editor if action is focused', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedAction: mockTool.actions[0],
      actionResults: {},
    }));
    render(<EditorActions />);
    expect(screen.getByTestId('action-editor')).toBeTruthy();
  });
});
