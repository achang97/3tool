import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorSwitch } from '../InspectorSwitch';

const mockLabel = 'label';
const mockHandleChange = jest.fn();

describe('InspectorSwitch', () => {
  it('renders label', () => {
    const result = render(<InspectorSwitch label={mockLabel} onChange={mockHandleChange} />);
    expect(result.getByText(mockLabel)).toBeTruthy();
  });

  it('calls onChange on click', async () => {
    const result = render(<InspectorSwitch label={mockLabel} onChange={mockHandleChange} />);
    await userEvent.click(result.getByRole('checkbox'));
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('renders checked value as true', () => {
    const result = render(
      <InspectorSwitch label={mockLabel} onChange={mockHandleChange} checked />
    );
    expect(result.getByRole('checkbox')).toBeChecked();
  });

  it('renders checked value as false', () => {
    const result = render(<InspectorSwitch label={mockLabel} onChange={mockHandleChange} />);
    expect(result.getByRole('checkbox')).not.toBeChecked();
  });
});
