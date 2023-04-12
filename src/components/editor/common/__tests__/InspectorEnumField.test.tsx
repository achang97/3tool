import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorEnumField } from '../InspectorEnumField';

const mockLabel = 'Label';
const mockOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
];
const mockHandleChange = jest.fn();

describe('InspectorEnumField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label', () => {
    render(
      <InspectorEnumField label={mockLabel} options={mockOptions} onChange={mockHandleChange} />
    );
    expect(screen.getByText(mockLabel)).toBeTruthy();
  });

  it('renders options', () => {
    render(
      <InspectorEnumField label={mockLabel} options={mockOptions} onChange={mockHandleChange} />
    );
    expect(screen.getByText(mockOptions[0].label)).toBeTruthy();
    expect(screen.getByText(mockOptions[1].label)).toBeTruthy();
  });

  it('calls onChange', async () => {
    render(
      <InspectorEnumField label={mockLabel} options={mockOptions} onChange={mockHandleChange} />
    );

    await userEvent.click(screen.getByText(mockOptions[0].label));
    expect(mockHandleChange).toHaveBeenCalledWith(mockOptions[0].value);

    await userEvent.click(screen.getByText(mockOptions[1].label));
    expect(mockHandleChange).toHaveBeenCalledWith(mockOptions[1].value);
  });

  it('does not call onChange if value is already selected', async () => {
    render(
      <InspectorEnumField
        label={mockLabel}
        options={mockOptions}
        value={mockOptions[0].value}
        onChange={mockHandleChange}
      />
    );

    await userEvent.click(screen.getByText(mockOptions[0].label));
    expect(mockHandleChange).not.toHaveBeenCalled();
  });
});
