import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormFieldLabel } from '../FormFieldLabel';

const mockLabel = 'Label';
const mockTooltip = 'Tooltip';

describe('FormFieldLabel', () => {
  it('renders label', () => {
    const result = render(<FormFieldLabel label={mockLabel} />);
    expect(result.getByText(mockLabel)).toBeTruthy();
  });

  it('renders tooltip on hover', async () => {
    const result = render(
      <FormFieldLabel label={mockLabel} tooltip={mockTooltip} />
    );

    await userEvent.hover(result.getByTestId('form-field-label-help'));
    expect(await result.findByText(mockTooltip)).toBeTruthy();
  });
});
