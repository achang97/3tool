import { render } from '@testing-library/react';
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
    const result = render(
      <InspectorEnumField
        label={mockLabel}
        options={mockOptions}
        onChange={mockHandleChange}
      />
    );
    expect(result.getByText(mockLabel)).toBeTruthy();
  });

  it('renders options', () => {
    const result = render(
      <InspectorEnumField
        label={mockLabel}
        options={mockOptions}
        onChange={mockHandleChange}
      />
    );
    expect(result.getByText(mockOptions[0].label)).toBeTruthy();
    expect(result.getByText(mockOptions[1].label)).toBeTruthy();
  });

  it('calls onChange', async () => {
    const result = render(
      <InspectorEnumField
        label={mockLabel}
        options={mockOptions}
        onChange={mockHandleChange}
      />
    );

    await userEvent.click(result.getByText(mockOptions[0].label));
    expect(mockHandleChange).toHaveBeenCalledWith(mockOptions[0].value);

    await userEvent.click(result.getByText(mockOptions[1].label));
    expect(mockHandleChange).toHaveBeenCalledWith(mockOptions[1].value);
  });

  it('does not call onChange if value is already selected', async () => {
    const result = render(
      <InspectorEnumField
        label={mockLabel}
        options={mockOptions}
        value={mockOptions[0].value}
        onChange={mockHandleChange}
      />
    );

    await userEvent.click(result.getByText(mockOptions[0].label));
    expect(mockHandleChange).not.toHaveBeenCalled();
  });
});
