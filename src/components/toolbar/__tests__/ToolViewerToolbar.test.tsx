import { render } from '@tests/utils/renderWithContext';
import { ToolViewerToolbar } from '../ToolViewerToolbar';

describe('ToolViewerToolbar', () => {
  it('renders title', () => {
    const result = render(<ToolViewerToolbar />);
    expect(result.getByText('Tool Viewer')).toBeDefined();
  });
});
