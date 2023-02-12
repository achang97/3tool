import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteComponentButton } from '../DeleteComponentButton';

const mockName = 'button1';
const mockDependents: string[] = ['textInput1.text', 'table1.data'];

const mockDeleteComponent = jest.fn();

jest.mock('../../../hooks/useDeleteComponent', () => ({
  useDeleteComponent: jest.fn(() => mockDeleteComponent),
}));

jest.mock('../../../hooks/useComponentDataDependents', () => ({
  useComponentDataDependents: jest.fn(() => mockDependents),
}));

describe('DeleteComponentButton', () => {
  const dialogId = 'delete-component-button-dialog';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Delete text', () => {
    const result = render(<DeleteComponentButton name={mockName} />);
    expect(result.getByText('Delete')).toBeTruthy();
  });

  it('renders description in confirmation dialog', async () => {
    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeTruthy();

    expect(result.getByText(`Are you sure you want to delete ${mockName}?`));
  });

  it('renders list of dependent fields in confirmation dialog', async () => {
    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeTruthy();

    expect(
      result.getByText(
        'You will need to manually delete the following JavaScript expression references: textInput1.text, table1.data'
      )
    );
  });

  it('opens confirmation dialog on click', async () => {
    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeTruthy();
  });

  it('closes confirmation dialog on Cancel click', async () => {
    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeTruthy();

    await userEvent.click(result.getByText('Cancel'));
    await waitFor(() => {
      expect(result.queryByTestId(dialogId)).toBeNull();
      expect(mockDeleteComponent).not.toHaveBeenCalled();
    });
  });

  it('closes dialog after successful deletion on Confirm click', async () => {
    mockDeleteComponent.mockImplementation(() => true);

    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeTruthy();

    await userEvent.click(result.getByText('Confirm'));
    await waitFor(() => {
      expect(mockDeleteComponent).toHaveBeenCalled();
      expect(result.queryByTestId(dialogId)).toBeNull();
    });
  });

  it('does not close dialog after failed deletion on Confirm click', async () => {
    mockDeleteComponent.mockImplementation(() => false);

    const result = render(<DeleteComponentButton name={mockName} />);

    await userEvent.click(result.getByText('Delete'));
    expect(result.getByTestId(dialogId)).toBeTruthy();

    await userEvent.click(result.getByText('Confirm'));
    await waitFor(() => {
      expect(mockDeleteComponent).toHaveBeenCalled();
      expect(result.getByTestId(dialogId)).toBeTruthy();
    });
  });
});
