import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { InspectorSelect } from '../InspectorSelect';

const mockLabel = 'label';
const mockHandleChange = jest.fn();
const mockOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
];

describe('InspectorSelect', () => {
  it('renders label', async () => {
    const result = render(
      <InspectorSelect
        label={mockLabel}
        onChange={mockHandleChange}
        options={mockOptions}
        value=""
      />
    );

    expect(result.getByLabelText(mockLabel)).toBeTruthy();
  });

  it('calls onChange with new value', async () => {
    const result = render(
      <InspectorSelect
        label={mockLabel}
        onChange={mockHandleChange}
        options={mockOptions}
        value=""
      />
    );

    await userEvent.click(result.getByLabelText(mockLabel));
    await userEvent.click(
      result.getByRole('option', { name: mockOptions[0].label })
    );
    expect(mockHandleChange).toHaveBeenCalledWith(mockOptions[0].value);
  });

  it('renders options', async () => {
    const result = render(
      <InspectorSelect
        label={mockLabel}
        onChange={mockHandleChange}
        options={mockOptions}
        value=""
      />
    );

    await userEvent.click(result.getByLabelText(mockLabel));
    const options = result.getAllByRole('option');

    expect(options.length).toEqual(mockOptions.length);
    expect(
      result.getByRole('option', { name: mockOptions[0].label })
    ).toBeTruthy();
    expect(result.getByRole('option', { name: mockOptions[1].label }));
  });
});
