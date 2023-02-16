import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { DepGraph } from 'dependency-graph';
import { EditorActions } from '../EditorActions';

jest.mock('../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
    updateTool: jest.fn(),
    componentEvalDataMap: {},
    componentEvalDataValuesMap: {},
    componentDataDepGraph: new DepGraph<string>(),
  })),
}));

describe('EditorActions', () => {
  it('renders action list', () => {
    const result = render(<EditorActions />);
    expect(result.getByTestId('action-list')).toBeTruthy();
  });

  it('renders action editor', () => {
    const result = render(<EditorActions />);
    expect(result.getByTestId('action-editor')).toBeTruthy();
  });
});
