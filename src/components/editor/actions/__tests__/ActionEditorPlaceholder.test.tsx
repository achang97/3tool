import { render } from '@tests/utils/renderWithContext';
import { ActionEditorPlaceholder } from '../ActionEditorPlaceholder';

describe('ActionEditorPlaceholder', () => {
  it('renders placeholder text', () => {
    const result = render(<ActionEditorPlaceholder />);
    expect(result.getByText('Select an action to edit')).toBeTruthy();
  });

  it('renders button to maximize / minimize editor', () => {
    const result = render(<ActionEditorPlaceholder />);
    expect(result.getByTestId('size-control-button')).toBeTruthy();
  });
});
