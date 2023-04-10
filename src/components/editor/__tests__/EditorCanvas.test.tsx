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

jest.mock('@app/redux/hooks', () => ({
  ...jest.requireActual('@app/redux/hooks'),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('EditorCanvas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('blurs component focus on canvas click', async () => {
    const result = render(<EditorCanvas isEditable />);

    await userEvent.click(result.getByTestId('editor-canvas'));
    expect(mockDispatch).toHaveBeenCalledWith(blurComponent());
  });

  it('does not render tool text if not editable', () => {
    const result = render(<EditorCanvas isEditable={false} />);
    expect(result.queryByText('tool')).toBeNull();
  });

  it('focuses tool settings on tool text click', async () => {
    const result = render(<EditorCanvas isEditable />);

    await userEvent.click(result.getByText('tool'));
    expect(mockDispatch).toHaveBeenCalledWith(focusToolSettings());
    expect(mockDispatch).not.toHaveBeenCalledWith(blurComponent());
  });

  it('renders canvas toolbar', () => {
    const result = render(<EditorCanvas isEditable />);
    expect(result.getByTestId('canvas-toolbar')).toBeTruthy();
  });

  it('renders droppable canvas', () => {
    const result = render(<EditorCanvas isEditable />);
    expect(result.getByTestId('canvas-droppable')).toBeTruthy();
  });
});
