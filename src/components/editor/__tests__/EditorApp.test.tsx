import { mockTool } from '@tests/constants/data';
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
  it('starts action queue executor', () => {
    render(<EditorApp isEditable />);
    expect(useActionQueueExecutor as jest.Mock).toHaveBeenCalled();
  });

  it('runs actions on mount', () => {
    render(<EditorApp isEditable />);
    expect(useActionMountExecute as jest.Mock).toHaveBeenCalled();
  });

  it('renders canvas toolbar', () => {
    const result = render(<EditorApp isEditable />);
    expect(result.getByTestId('canvas-toolbar')).toBeTruthy();
  });

  it('renders droppable canvas', () => {
    const result = render(<EditorApp isEditable />);
    expect(result.getByTestId('canvas-droppable')).toBeTruthy();
  });
});
