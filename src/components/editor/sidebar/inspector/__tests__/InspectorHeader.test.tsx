import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorHeader } from '../InspectorHeader';

const mockHandleSubmit = jest.fn();
const mockIcon = 'icon';
const mockSubtitle = 'subtitle';
const mockTitle = 'hello';

describe('InspectorHeader', () => {
  const editableTextId = 'editable-text-field-view';
  const editableInputId = 'editable-text-field-edit';
  const editableEditIconId = 'editable-text-field-edit-icon';
  const editableDisabledIconId = 'editable-text-field-disabled-icon';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders icon', () => {
    render(
      <InspectorHeader title={mockTitle} onSubmit={mockHandleSubmit} icon={mockIcon} isEditable />
    );
    expect(screen.getByText(mockIcon)).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(
      <InspectorHeader
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
        isEditable
      />
    );
    expect(screen.getByText(mockSubtitle)).toBeTruthy();
  });

  it('renders value', () => {
    render(
      <InspectorHeader
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
        isEditable
      />
    );
    expect(screen.getByText(mockTitle)).toBeTruthy();
  });

  it('toggles input and calls onSubmit on enter if isEditable is true', async () => {
    render(
      <InspectorHeader
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
        isEditable
      />
    );

    await userEvent.click(screen.getByTestId(editableTextId));
    await screen.findByTestId(editableInputId);

    const newNameText = '1234';
    await userEvent.keyboard(newNameText);
    await userEvent.keyboard('[Enter]');

    expect(mockHandleSubmit).toHaveBeenCalledWith(`${mockTitle}${newNameText}`);
  });

  it('does not toggle input field on click if isEditable is false', async () => {
    render(
      <InspectorHeader
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
        isEditable={false}
      />
    );

    await userEvent.click(screen.getByTestId(editableTextId));
    expect(screen.queryByTestId(editableInputId)).toBeNull();
  });

  it('shows icon if isEditable is true and hovering', async () => {
    render(
      <InspectorHeader
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
        isEditable
      />
    );

    await userEvent.hover(screen.getByTestId(editableTextId));
    expect(screen.getByTestId(editableEditIconId)).toBeVisible();
  });

  it('does not show icon if isEditable is false and hovering', async () => {
    render(
      <InspectorHeader
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        icon={mockIcon}
        subtitle={mockSubtitle}
        isEditable={false}
      />
    );

    await userEvent.hover(screen.getByTestId(editableTextId));
    expect(screen.getByTestId(editableDisabledIconId)).not.toBeVisible();
  });
});
