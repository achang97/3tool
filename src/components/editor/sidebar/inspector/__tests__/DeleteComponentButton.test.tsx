import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { DeleteComponentButton } from '../DeleteComponentButton';

const mockName = 'button1';
const mockDependents = ['textInput1.text', 'table1.data'];

const mockDeleteComponent = jest.fn();

jest.mock('../../../hooks/useComponentDelete', () => ({
  useComponentDelete: jest.fn(() => mockDeleteComponent),
}));

jest.mock('../../../hooks/useElementDependentFields', () => ({
  useElementDependentFields: jest.fn(() => mockDependents),
}));

describe('DeleteComponentButton', () => {
  const dialogId = 'delete-dialog';
  const dialogContentId = 'delete-dialog-content';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Delete text', () => {
    render(<DeleteComponentButton name={mockName} />);
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('opens confirmation dialog on click', async () => {
    render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId(dialogId)).toBeTruthy();
  });

  // it('opens confirmation dialog on backspace', async () => {
  //   render(<DeleteComponentButton name={mockName} />);

  //   await userEvent.keyboard('[Backspace]');
  //   expect(screen.getByTestId(dialogId)).toBeTruthy();
  // });

  it('renders description in confirmation dialog', async () => {
    render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId(dialogId)).toBeTruthy();

    expect(screen.getByText(`Are you sure you want to delete ${mockName}?`));
  });

  it('renders list of dependent fields in confirmation dialog', async () => {
    render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId(dialogId)).toBeTruthy();

    expect(screen.getByTestId(dialogContentId)).toHaveTextContent(
      'You will need to manually delete the following JavaScript expression references: textInput1.text, table1.data'
    );
  });

  it('closes confirmation dialog on Cancel click', async () => {
    render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId(dialogId)).toBeTruthy();

    await userEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByTestId(dialogId)).toBeNull();
      expect(mockDeleteComponent).not.toHaveBeenCalled();
    });
  });

  it('closes dialog after successful deletion on Confirm click', async () => {
    mockDeleteComponent.mockImplementation(() => true);

    render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId(dialogId)).toBeTruthy();

    await userEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      expect(mockDeleteComponent).toHaveBeenCalled();
      expect(screen.queryByTestId(dialogId)).toBeNull();
    });
  });

  it('does not close dialog after failed deletion on Confirm click', async () => {
    mockDeleteComponent.mockImplementation(() => false);

    render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId(dialogId)).toBeTruthy();

    await userEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      expect(mockDeleteComponent).toHaveBeenCalled();
      expect(screen.getByTestId(dialogId)).toBeTruthy();
    });
  });
});
