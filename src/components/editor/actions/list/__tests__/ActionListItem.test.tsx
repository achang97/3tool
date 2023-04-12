import { useActionConfirmDiscard } from '@app/components/editor/hooks/useActionConfirmDiscard';
import { useActionIsEditing } from '@app/components/editor/hooks/useActionIsEditing';
import { focusAction } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { Action, ActionType } from '@app/types';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionListItem } from '../ActionListItem';

const mockAction = {
  name: 'action1',
  type: ActionType.Javascript,
} as Action;
const mockDependents = ['textInput1.text', 'table1.data'];

const mockDispatch = jest.fn();
const mockUpdateActionName = jest.fn();
const mockDeleteAction = jest.fn();

jest.mock('../../../hooks/useActionUpdateName', () => ({
  useActionUpdateName: jest.fn(() => mockUpdateActionName),
}));

jest.mock('../../../hooks/useActionDelete', () => ({
  useActionDelete: jest.fn(() => mockDeleteAction),
}));

jest.mock('../../../hooks/useElementDependentFields', () => ({
  useElementDependentFields: jest.fn(() => mockDependents),
}));

jest.mock('../../../hooks/useActionIsEditing');
jest.mock('../../../hooks/useActionConfirmDiscard');

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

describe('ActionListItem', () => {
  const editableInputId = 'editable-text-field-edit';
  const editableEditIconId = 'editable-text-field-edit-icon';
  const editableDisabledIconId = 'editable-text-field-disabled-icon';
  const menuButtonId = 'action-list-item-menu-button';
  const deleteDialogId = 'delete-dialog';
  const deleteDialogContentId = 'delete-dialog';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
    (useActionConfirmDiscard as jest.Mock).mockImplementation(() => () => true);
    (useActionIsEditing as jest.Mock).mockImplementation(() => false);
  });

  it('renders name', () => {
    render(<ActionListItem action={mockAction} />);
    expect(screen.getByText(mockAction.name)).toBeTruthy();
  });

  describe('focus', () => {
    it('focuses action on click', async () => {
      render(<ActionListItem action={mockAction} />);
      await userEvent.click(screen.getByText(mockAction.name));
      expect(mockDispatch).toHaveBeenCalledWith(focusAction(mockAction));
    });

    it('does not focus action if already focused', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: mockAction,
      }));

      render(<ActionListItem action={mockAction} />);
      await userEvent.click(screen.getByText(mockAction.name));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not focus action if user cancels in alert', async () => {
      (useActionConfirmDiscard as jest.Mock).mockImplementation(() => () => false);

      render(<ActionListItem action={mockAction} />);
      await userEvent.click(screen.getByText(mockAction.name));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('renders with offwhite background if focused', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: mockAction,
      }));
      const result = render(<ActionListItem action={mockAction} />);
      expect(result.container.firstChild).toHaveStyle({
        backgroundColor: 'greyscale.offwhite.main',
      });
    });

    it('renders with default background if not focused', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: undefined,
      }));
      const result = render(<ActionListItem action={mockAction} />);
      expect(result.container.firstChild).toHaveStyle({
        backgroundColor: undefined,
      });
    });
  });

  describe('update name', () => {
    it('does not toggle edit mode for name if not focused', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: undefined,
      }));
      render(<ActionListItem action={mockAction} />);
      await userEvent.click(screen.getByText(mockAction.name));
      expect(screen.queryByTestId(editableInputId)).toBeNull();
    });

    it('does not toggle edit mode for name if focused and editing action', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: mockAction,
      }));
      (useActionIsEditing as jest.Mock).mockImplementation(() => true);

      render(<ActionListItem action={mockAction} />);
      await userEvent.click(screen.getByText(mockAction.name));
      expect(screen.queryByTestId(editableInputId)).toBeNull();
    });

    it('does not show icon on hover if not focused', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: undefined,
      }));
      render(<ActionListItem action={mockAction} />);
      await userEvent.hover(screen.getByText(mockAction.name));
      expect(screen.getByTestId(editableDisabledIconId)).not.toBeVisible();
    });

    it('shows icon on hover if focused', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: mockAction,
      }));
      (useActionIsEditing as jest.Mock).mockImplementation(() => false);

      render(<ActionListItem action={mockAction} />);
      await userEvent.hover(screen.getByText(mockAction.name));
      expect(screen.getByTestId(editableEditIconId)).toBeVisible();
    });

    it('shows tooltip on icon hover if not editable', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: mockAction,
      }));
      (useActionIsEditing as jest.Mock).mockImplementation(() => true);

      render(<ActionListItem action={mockAction} />);
      await userEvent.hover(screen.getByTestId(editableDisabledIconId));
      expect(
        await screen.findByText('You must save any changes before this can be renamed.')
      ).toBeTruthy();
    });

    it('toggles edit mode and updates action name if focused and not editing', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: mockAction,
      }));
      (useActionIsEditing as jest.Mock).mockImplementation(() => false);

      render(<ActionListItem action={mockAction} />);
      await userEvent.click(screen.getByText(mockAction.name));
      await screen.findByTestId(editableInputId);

      const newNameText = '1234';
      await userEvent.keyboard(newNameText);
      await userEvent.keyboard('[Enter]');

      expect(mockUpdateActionName).toHaveBeenCalledWith(`${mockAction.name}${newNameText}`);
    });
  });

  describe('delete', () => {
    it('renders Delete text in menu', async () => {
      render(<ActionListItem action={mockAction} />);

      await userEvent.click(screen.getByTestId(menuButtonId));
      expect(screen.getByText('Delete')).toBeTruthy();
    });

    it('opens confirmation dialog on click', async () => {
      render(<ActionListItem action={mockAction} />);

      await userEvent.click(screen.getByTestId(menuButtonId));
      await userEvent.click(screen.getByText('Delete'));
      expect(screen.getByTestId(deleteDialogId)).toBeTruthy();
    });

    it('renders description in confirmation dialog', async () => {
      render(<ActionListItem action={mockAction} />);

      await userEvent.click(screen.getByTestId(menuButtonId));
      await userEvent.click(screen.getByText('Delete'));
      expect(screen.getByTestId(deleteDialogId)).toBeTruthy();

      expect(screen.getByText(`Are you sure you want to delete ${mockAction.name}?`));
    });

    it('renders list of dependent fields in confirmation dialog', async () => {
      render(<ActionListItem action={mockAction} />);

      await userEvent.click(screen.getByTestId(menuButtonId));
      await userEvent.click(screen.getByText('Delete'));
      expect(screen.getByTestId(deleteDialogId)).toBeTruthy();

      expect(screen.getByTestId(deleteDialogContentId)).toHaveTextContent(
        'You will need to manually delete the following JavaScript expression references: textInput1.text, table1.data'
      );
    });

    it('closes confirmation dialog on Cancel click', async () => {
      render(<ActionListItem action={mockAction} />);

      await userEvent.click(screen.getByTestId(menuButtonId));
      await userEvent.click(screen.getByText('Delete'));
      expect(screen.getByTestId(deleteDialogId)).toBeTruthy();

      await userEvent.click(screen.getByText('Cancel'));
      await waitFor(() => {
        expect(screen.queryByTestId(deleteDialogId)).toBeNull();
        expect(mockDeleteAction).not.toHaveBeenCalled();
      });
    });

    it('closes dialog after successful deletion on Confirm click', async () => {
      mockDeleteAction.mockImplementation(() => true);

      render(<ActionListItem action={mockAction} />);

      await userEvent.click(screen.getByTestId(menuButtonId));
      await userEvent.click(screen.getByText('Delete'));
      expect(screen.getByTestId(deleteDialogId)).toBeTruthy();

      await userEvent.click(screen.getByText('Confirm'));
      await waitFor(() => {
        expect(mockDeleteAction).toHaveBeenCalled();
        expect(screen.queryByTestId(deleteDialogId)).toBeNull();
      });
    });

    it('does not close dialog after failed deletion on Confirm click', async () => {
      mockDeleteAction.mockImplementation(() => false);

      render(<ActionListItem action={mockAction} />);

      await userEvent.click(screen.getByTestId(menuButtonId));
      await userEvent.click(screen.getByText('Delete'));
      expect(screen.getByTestId(deleteDialogId)).toBeTruthy();

      await userEvent.click(screen.getByText('Confirm'));
      await waitFor(() => {
        expect(mockDeleteAction).toHaveBeenCalled();
        expect(screen.getByTestId(deleteDialogId)).toBeTruthy();
      });
    });
  });
});
