import { render } from '@tests/utils/renderWithContext';
import { EditorComponentPicker } from '../EditorComponentPicker';

describe('EditorComponentPicker', () => {
  it.each([
    'Button',
    'Text Input',
    'Number Input',
    'Select',
    'Container',
    'Text',
    'Table',
  ])('renders %s component', (componentLabel: string) => {
    const result = render(<EditorComponentPicker />);
    expect(result.getByText(componentLabel)).toBeDefined();
  });
});
