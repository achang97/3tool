import { mockTool } from '@tests/constants/data';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { render } from '@tests/utils/renderWithContext';
import { ToolViewerToolbar } from '../ToolViewerToolbar';

jest.mock('@app/components/editor/hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
  })),
}));

describe('ToolViewerToolbar', () => {
  it('renders tool name', () => {
    const result = render(<ToolViewerToolbar />);
    expect(result.getByText(mockTool.name)).toBeTruthy();
  });

  it('renders "Edit app" button to go to /editor/:id route', () => {
    const result = render(<ToolViewerToolbar />);

    const editAppButton = result.getByText('Edit app');
    expect(editAppButton).toHaveProperty('href', `${BASE_WINDOW_URL}/editor/${mockTool._id}`);
  });
});
