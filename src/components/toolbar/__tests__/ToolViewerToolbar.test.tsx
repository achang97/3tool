import { mockTool } from '@tests/constants/data';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { ToolViewerToolbar } from '../ToolViewerToolbar';

jest.mock('@app/components/editor/hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
  })),
}));

describe('ToolViewerToolbar', () => {
  it('renders tool name', () => {
    render(<ToolViewerToolbar />);
    expect(screen.getByText(mockTool.name)).toBeTruthy();
  });

  it('renders "Edit app" button to go to /editor/:id route', () => {
    render(<ToolViewerToolbar />);

    const editAppButton = screen.getByText('Edit app');
    expect(editAppButton).toHaveProperty('href', `${BASE_WINDOW_URL}/editor/${mockTool._id}`);
  });
});
