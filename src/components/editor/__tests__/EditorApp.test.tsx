import { mockTool } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { DepGraph } from 'dependency-graph';
import { EditorApp } from '../EditorApp';
import { useActionMountExecute } from '../hooks/useActionMountExecute';
import { useActionQueueExecutor } from '../hooks/useActionQueueExecutor';

jest.mock('../hooks/useActionQueueExecutor');
jest.mock('../hooks/useActionMountExecute');

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

describe('EditorApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActionMountExecute as jest.Mock).mockImplementation(() => ({}));
  });

  it('starts action queue executor', () => {
    render(<EditorApp isEditable />);
    expect(useActionQueueExecutor as jest.Mock).toHaveBeenCalled();
  });

  it('runs actions on mount', () => {
    render(<EditorApp isEditable />);
    expect(useActionMountExecute as jest.Mock).toHaveBeenCalled();
  });

  it('renders canvas toolbar', () => {
    render(<EditorApp isEditable />);
    expect(screen.getByTestId('canvas-toolbar')).toBeTruthy();
  });

  it('renders loader instead of droppable canvas if actions have not executed', () => {
    (useActionMountExecute as jest.Mock).mockImplementation(() => ({ isLoading: true }));
    render(<EditorApp isEditable />);
    expect(screen.getByTestId('fullscreen-loader')).toBeTruthy();
    expect(screen.queryByTestId('canvas-droppable')).toBeNull();
  });

  it('renders droppable canvas if actions have executed', () => {
    (useActionMountExecute as jest.Mock).mockImplementation(() => ({ isLoading: false }));
    render(<EditorApp isEditable />);
    expect(screen.queryByTestId('fullscreen-loader')).toBeNull();
    expect(screen.getByTestId('canvas-droppable')).toBeTruthy();
  });
});
