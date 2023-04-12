import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteDialog } from '../DeleteDialog';

const mockName = 'button1';
const mockDependents = ['textInput1.text', 'table1.data'];
const mockHandleClose = jest.fn();
const mockHandleDelete = jest.fn();

jest.mock('../../hooks/useElementDependentFields', () => ({
  useElementDependentFields: jest.fn(() => mockDependents),
}));

describe('DeleteDialog', () => {
  const dialogId = 'delete-dialog';
  const dialogContentId = 'delete-dialog-content';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render dialog if isOpen is false', () => {
    render(
      <DeleteDialog
        name={mockName}
        onClose={mockHandleClose}
        onDelete={mockHandleDelete}
        isOpen={false}
      />
    );
    expect(screen.queryByTestId(dialogId)).toBeNull();
  });

  it('renders description in confirmation dialog', async () => {
    render(
      <DeleteDialog name={mockName} onClose={mockHandleClose} onDelete={mockHandleDelete} isOpen />
    );
    expect(screen.getByText(`Are you sure you want to delete ${mockName}?`));
  });

  it('renders list of dependent fields in confirmation dialog', async () => {
    render(
      <DeleteDialog name={mockName} onClose={mockHandleClose} onDelete={mockHandleDelete} isOpen />
    );
    expect(screen.getByTestId(dialogContentId)).toHaveTextContent(
      'You will need to manually delete the following JavaScript expression references: textInput1.text, table1.data'
    );
  });

  it('closes confirmation dialog on Cancel click', async () => {
    render(
      <DeleteDialog name={mockName} onClose={mockHandleClose} onDelete={mockHandleDelete} isOpen />
    );

    await userEvent.click(screen.getByText('Cancel'));
    expect(mockHandleDelete).not.toHaveBeenCalled();
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('closes dialog after successful deletion on Confirm click', async () => {
    mockHandleDelete.mockImplementation(() => true);

    render(
      <DeleteDialog name={mockName} onClose={mockHandleClose} onDelete={mockHandleDelete} isOpen />
    );

    await userEvent.click(screen.getByText('Confirm'));
    expect(mockHandleDelete).toHaveBeenCalled();
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('does not close dialog after failed deletion on Confirm click', async () => {
    mockHandleDelete.mockImplementation(() => false);

    render(
      <DeleteDialog name={mockName} onClose={mockHandleClose} onDelete={mockHandleDelete} isOpen />
    );

    await userEvent.click(screen.getByText('Confirm'));
    expect(mockHandleDelete).toHaveBeenCalled();
    expect(mockHandleClose).not.toHaveBeenCalled();
  });
});
