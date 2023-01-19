import { render } from '@tests/utils/renderWithContext';
import { ComponentPicker } from '../ComponentPicker';

jest.mock('../../hooks/useGetActiveTool', () => ({
  useGetActiveTool: jest.fn(() => undefined),
}));

describe('ComponentPicker', () => {
  it.each([
    'Button',
    'Text Input',
    'Number Input',
    'Select',
    'Container',
    'Text',
    'Table',
  ])('renders %s component', (componentLabel: string) => {
    const result = render(<ComponentPicker />);
    expect(result.getByText(componentLabel)).toBeDefined();
  });
});
