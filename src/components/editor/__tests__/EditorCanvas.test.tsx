import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { blurComponent, focusToolSettings } from '@app/redux/features/editorSlice';
import { mockTool } from '@tests/constants/data';
import { DepGraph } from 'dependency-graph';
import { EditorCanvas } from '../EditorCanvas';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

jest.mock('../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
    updateTool: mockUpdateTool,
    evalDataMap: {},
    evalDataValuesMap: {},
    dataDepGraph: new DepGraph<string>(),
  })),
}));

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useGetResourcesQuery: jest.fn(() => ({ data: [] })),
}));

jest.mock('@app/redux/hooks', () => ({
  ...jest.requireActual('@app/redux/hooks'),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('EditorCanvas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('blurs component focus on canvas click', async () => {
    render(<EditorCanvas isEditable />);

    await userEvent.click(screen.getByTestId('editor-canvas'));
    expect(mockDispatch).toHaveBeenCalledWith(blurComponent());
  });

  it('does not render tool text if not editable', () => {
    render(<EditorCanvas isEditable={false} />);
    expect(screen.queryByText('tool')).toBeNull();
  });

  it('focuses tool settings on tool text click', async () => {
    render(<EditorCanvas isEditable />);

    await userEvent.click(screen.getByText('app'));
    expect(mockDispatch).toHaveBeenCalledWith(focusToolSettings());
    expect(mockDispatch).not.toHaveBeenCalledWith(blurComponent());
  });

  it('renders canvas toolbar', () => {
    render(<EditorCanvas isEditable />);
    expect(screen.getByTestId('canvas-toolbar')).toBeTruthy();
  });

  it('renders droppable canvas', () => {
    render(<EditorCanvas isEditable />);
    expect(screen.getByTestId('canvas-droppable')).toBeTruthy();
  });
});
