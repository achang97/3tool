import { focusAction } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { ActionType } from '@app/types';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionListItem } from '../ActionListItem';

const mockName = 'action1';
const mockType = ActionType.Javascript;
const mockDependents = ['textInput1.text', 'table1.data'];

const mockDispatch = jest.fn();
const mockUpdateActionName = jest.fn();
const mockDeleteAction = jest.fn();

jest.mock('../../../hooks/useUpdateActionName', () => ({
  useUpdateActionName: jest.fn(() => mockUpdateActionName),
}));

jest.mock('../../../hooks/useDeleteAction', () => ({
  useDeleteAction: jest.fn(() => mockDeleteAction),
}));

jest.mock('../../../hooks/useElementDependentFields', () => ({
  useElementDependentFields: jest.fn(() => mockDependents),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

describe('ActionListItem', () => {
  const editableInputId = 'editable-text-field-edit';
  const menuButtonId = 'action-list-item-menu-button';
  const deleteDialogId = 'delete-dialog';
  const deleteDialogContentId = 'delete-dialog';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  it('renders name', () => {
    const result = render(<ActionListItem name={mockName} type={mockType} />);
    expect(result.getByText(mockName)).toBeTruthy();
  });

  describe('focus', () => {
    it('focuses action on click', async () => {
      const result = render(<ActionListItem name={mockName} type={mockType} />);
      await userEvent.click(result.getByText(mockName));
      expect(mockDispatch).toHaveBeenCalledWith(focusAction(mockName));
    });

    it('renders with offwhite background if focused', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedActionName: mockName,
      }));
      const result = render(<ActionListItem name={mockName} type={mockType} />);
      expect(result.container.firstChild).toHaveStyle({
        backgroundColor: 'greyscale.offwhite.main',
      });
    });

    it('renders with default background if not focused', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedActionName: undefined,
      }));
      const result = render(<ActionListItem name={mockName} type={mockType} />);
      expect(result.container.firstChild).toHaveStyle({
        backgroundColor: undefined,
      });
    });
  });

  describe('update name', () => {
    it('does not toggle edit mode for name if not focused', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedActionName: undefined,
      }));
      const result = render(<ActionListItem name={mockName} type={mockType} />);
      await userEvent.click(result.getByText(mockName));
      expect(result.queryByTestId(editableInputId)).toBeNull();
    });

    it('toggles edit mode if focused and updates action name', async () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedActionName: mockName,
      }));
      const result = render(<ActionListItem name={mockName} type={mockType} />);
      await userEvent.click(result.getByText(mockName));
      await result.findByTestId(editableInputId);

      const newNameText = '1234';
      await userEvent.keyboard(newNameText);
      await userEvent.keyboard('[Enter]');

      expect(mockUpdateActionName).toHaveBeenCalledWith(
        `${mockName}${newNameText}`
      );
    });
  });

  describe('delete', () => {
    it('renders Delete text in menu', async () => {
      const result = render(<ActionListItem name={mockName} type={mockType} />);

      await userEvent.click(result.getByTestId(menuButtonId));
      expect(result.getByText('Delete')).toBeTruthy();
    });

    it('opens confirmation dialog on click', async () => {
      const result = render(<ActionListItem name={mockName} type={mockType} />);

      await userEvent.click(result.getByTestId(menuButtonId));
      await userEvent.click(result.getByText('Delete'));
      expect(result.getByTestId(deleteDialogId)).toBeTruthy();
    });

    it('renders description in confirmation dialog', async () => {
      const result = render(<ActionListItem name={mockName} type={mockType} />);

      await userEvent.click(result.getByTestId(menuButtonId));
      await userEvent.click(result.getByText('Delete'));
      expect(result.getByTestId(deleteDialogId)).toBeTruthy();

      expect(result.getByText(`Are you sure you want to delete ${mockName}?`));
    });

    it('renders list of dependent fields in confirmation dialog', async () => {
      const result = render(<ActionListItem name={mockName} type={mockType} />);

      await userEvent.click(result.getByTestId(menuButtonId));
      await userEvent.click(result.getByText('Delete'));
      expect(result.getByTestId(deleteDialogId)).toBeTruthy();

      expect(result.getByTestId(deleteDialogContentId)).toHaveTextContent(
        'You will need to manually delete the following JavaScript expression references: textInput1.text, table1.data'
      );
    });

    it('closes confirmation dialog on Cancel click', async () => {
      const result = render(<ActionListItem name={mockName} type={mockType} />);

      await userEvent.click(result.getByTestId(menuButtonId));
      await userEvent.click(result.getByText('Delete'));
      expect(result.getByTestId(deleteDialogId)).toBeTruthy();

      await userEvent.click(result.getByText('Cancel'));
      await waitFor(() => {
        expect(result.queryByTestId(deleteDialogId)).toBeNull();
        expect(mockDeleteAction).not.toHaveBeenCalled();
      });
    });

    it('closes dialog after successful deletion on Confirm click', async () => {
      mockDeleteAction.mockImplementation(() => true);

      const result = render(<ActionListItem name={mockName} type={mockType} />);

      await userEvent.click(result.getByTestId(menuButtonId));
      await userEvent.click(result.getByText('Delete'));
      expect(result.getByTestId(deleteDialogId)).toBeTruthy();

      await userEvent.click(result.getByText('Confirm'));
      await waitFor(() => {
        expect(mockDeleteAction).toHaveBeenCalled();
        expect(result.queryByTestId(deleteDialogId)).toBeNull();
      });
    });

    it('does not close dialog after failed deletion on Confirm click', async () => {
      mockDeleteAction.mockImplementation(() => false);

      const result = render(<ActionListItem name={mockName} type={mockType} />);

      await userEvent.click(result.getByTestId(menuButtonId));
      await userEvent.click(result.getByText('Delete'));
      expect(result.getByTestId(deleteDialogId)).toBeTruthy();

      await userEvent.click(result.getByText('Confirm'));
      await waitFor(() => {
        expect(mockDeleteAction).toHaveBeenCalled();
        expect(result.getByTestId(deleteDialogId)).toBeTruthy();
      });
    });
  });
});
