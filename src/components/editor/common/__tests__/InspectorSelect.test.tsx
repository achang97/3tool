import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
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
    render(
      <InspectorSelect
        label={mockLabel}
        onChange={mockHandleChange}
        options={mockOptions}
        value=""
      />
    );

    expect(screen.getByLabelText(mockLabel)).toBeTruthy();
  });

  it('calls onChange with new value', async () => {
    render(
      <InspectorSelect
        label={mockLabel}
        onChange={mockHandleChange}
        options={mockOptions}
        value=""
      />
    );

    await userEvent.click(screen.getByLabelText(mockLabel));
    await userEvent.click(screen.getByRole('option', { name: mockOptions[0].label }));
    expect(mockHandleChange).toHaveBeenCalledWith(mockOptions[0].value);
  });

  it('renders options', async () => {
    render(
      <InspectorSelect
        label={mockLabel}
        onChange={mockHandleChange}
        options={mockOptions}
        value=""
      />
    );

    await userEvent.click(screen.getByLabelText(mockLabel));
    const options = screen.getAllByRole('option');

    expect(options.length).toEqual(mockOptions.length);
    expect(screen.getByRole('option', { name: mockOptions[0].label })).toBeTruthy();
    expect(screen.getByRole('option', { name: mockOptions[1].label }));
  });
});
