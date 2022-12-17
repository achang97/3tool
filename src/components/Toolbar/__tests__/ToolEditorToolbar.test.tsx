import { render } from '@tests/utils/renderWithContext';
import { ToolEditorToolbar } from '../ToolEditorToolbar';

describe('ToolEditorToolbar', () => {
  it('renders title', () => {
    const result = render(<ToolEditorToolbar />);
    expect(result.getByText('Tool Editor')).toBeDefined();
  });
});
