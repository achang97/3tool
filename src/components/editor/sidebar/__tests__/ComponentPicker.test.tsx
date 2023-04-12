import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { ComponentPicker } from '../ComponentPicker';

describe('ComponentPicker', () => {
  it.each(['Button', 'Text Input', 'Number Input', 'Text', 'Table'])(
    'renders %s component',
    (componentLabel: string) => {
      render(<ComponentPicker />);
      expect(screen.getByText(componentLabel)).toBeTruthy();
    }
  );
});
