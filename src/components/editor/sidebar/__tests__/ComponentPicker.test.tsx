import { render } from '@tests/utils/renderWithContext';
import { ComponentPicker } from '../ComponentPicker';

describe('ComponentPicker', () => {
  it.each(['Button', 'Text Input', 'Number Input', 'Text', 'Table'])(
    'renders %s component',
    (componentLabel: string) => {
      const result = render(<ComponentPicker />);
      expect(result.getByText(componentLabel)).toBeTruthy();
    }
  );
});
