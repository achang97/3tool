import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorEditableName } from '../InspectorEditableName';

const mockHandleSubmit = jest.fn();
const mockIcon = 'icon';
const mockSubtitle = 'subtitle';
const mockValue = 'hello';

describe('InspectorEditableName', () => {
  const editableTextId = 'editable-text-field-view';
  const editableInputId = 'editable-text-field-edit';

  it('renders icon', () => {
    const result = render(
      <InspectorEditableName
        value={mockValue}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
      />
    );
    expect(result.getByText(mockIcon)).toBeDefined();
  });

  it('renders subtitle', () => {
    const result = render(
      <InspectorEditableName
        value={mockValue}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
      />
    );
    expect(result.getByText(mockSubtitle)).toBeDefined();
  });

  it('renders value', () => {
    const result = render(
      <InspectorEditableName
        value={mockValue}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
      />
    );
    expect(result.getByText(mockValue)).toBeDefined();
  });

  it('toggles input and calls onSubmit on enter if editable is true', async () => {
    const result = render(
      <InspectorEditableName
        value={mockValue}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
      />
    );

    await userEvent.click(result.getByTestId(editableTextId));
    await result.findByTestId(editableInputId);

    const newNameText = '1234';
    await userEvent.keyboard(newNameText);
    await userEvent.keyboard('[Enter]');

    expect(mockHandleSubmit).toHaveBeenCalledWith(`${mockValue}${newNameText}`);
  });

  it('does not toggle input field on click if editable is false', async () => {
    const result = render(
      <InspectorEditableName
        value={mockValue}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
        editable={false}
      />
    );

    await userEvent.click(result.getByTestId(editableTextId));
    expect(result.queryByTestId(editableInputId)).toBeNull();
  });
});
