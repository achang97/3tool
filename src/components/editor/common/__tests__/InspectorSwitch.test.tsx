import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorSwitch } from '../InspectorSwitch';

const mockLabel = 'label';
const mockHandleChange = jest.fn();

describe('InspectorSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    render(<InspectorSwitch label={mockLabel} onChange={mockHandleChange} />);
    expect(screen.getByText(mockLabel)).toBeTruthy();
  });

  it('calls onChange on click', async () => {
    render(<InspectorSwitch label={mockLabel} onChange={mockHandleChange} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(mockHandleChange).toHaveBeenCalledWith(true);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(mockHandleChange).toHaveBeenCalledWith(false);
  });

  it('renders checked value as true', () => {
    render(<InspectorSwitch label={mockLabel} onChange={mockHandleChange} checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders checked value as false', () => {
    render(<InspectorSwitch label={mockLabel} onChange={mockHandleChange} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
