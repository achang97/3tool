import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableTextField } from '../EditableTextField';

const mockHandleSubmit = jest.fn();
const mockValue = 'Some Value';

describe('EditableTextField', () => {
  const textId = 'editable-text-field-view';
  const inputId = 'editable-text-field-edit';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders value as text', () => {
    const result = render(<EditableTextField value={mockValue} />);
    expect(result.getByTestId(textId)).toHaveTextContent(mockValue);
  });

  it('toggles to text field if editable', async () => {
    const result = render(<EditableTextField value={mockValue} />);

    await userEvent.click(result.getByTestId(textId));
    expect(await result.findByTestId(inputId)).toHaveValue(mockValue);
  });

  it('does not toggle to text field if not editable', async () => {
    const result = render(
      <EditableTextField value={mockValue} editable={false} />
    );

    await userEvent.click(result.getByTestId(textId));
    expect(result.queryByTestId(inputId)).toBeNull();
  });

  it('calls onSubmit on input blur', async () => {
    const result = render(
      <>
        <EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />
        <div>Blur</div>
      </>
    );

    await userEvent.click(result.getByTestId(textId));
    await result.findByTestId(inputId);

    const newValueText = '1234';
    await userEvent.keyboard(newValueText);

    await userEvent.click(result.getByText('Blur'));
    expect(mockHandleSubmit).toHaveBeenCalledWith(
      `${mockValue}${newValueText}`
    );
  });

  it('calls onSubmit on enter keypress', async () => {
    const result = render(
      <EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />
    );

    await userEvent.click(result.getByTestId(textId));
    await result.findByTestId(inputId);

    const newValueText = '1234';
    await userEvent.keyboard(newValueText);
    await userEvent.keyboard('[Enter]');

    expect(mockHandleSubmit).toHaveBeenCalledWith(
      `${mockValue}${newValueText}`
    );
  });

  it('does not call onSubmit if value has not changed', async () => {
    const result = render(
      <EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />
    );

    await userEvent.click(result.getByTestId(textId));
    await result.findByTestId(inputId);
    await userEvent.keyboard('[Enter]');

    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('resets local value to initial value on submit', async () => {
    const result = render(
      <EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />
    );

    await userEvent.click(result.getByTestId(textId));
    await result.findByTestId(inputId);

    const newValueText = '1234';
    await userEvent.keyboard(newValueText);
    await userEvent.keyboard('[Enter]');

    expect(mockHandleSubmit).toHaveBeenCalledWith(
      `${mockValue}${newValueText}`
    );

    await userEvent.click(result.getByTestId(textId));
    expect(await result.findByTestId(inputId)).toHaveValue(mockValue);
  });

  it('resets local value to new value', async () => {
    const result = render(
      <EditableTextField value={mockValue} onSubmit={mockHandleSubmit} />
    );

    await userEvent.click(result.getByTestId(textId));
    expect(await result.findByTestId(inputId)).toHaveValue(mockValue);
    await userEvent.keyboard('[Enter]');

    const newValue = 'New Value';
    result.rerender(
      <EditableTextField value={newValue} onSubmit={mockHandleSubmit} />
    );
    await userEvent.click(result.getByTestId(textId));
    expect(await result.findByTestId(inputId)).toHaveValue(newValue);
  });
});
