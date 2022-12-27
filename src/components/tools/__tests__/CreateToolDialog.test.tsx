import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCreateToolMutation } from '@app/redux/services/tools';
import { CreateToolDialog } from '../CreateToolDialog';

const mockHandleClose = jest.fn();

const mockPush = jest.fn();
const mockCreateTool = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock('@app/redux/services/tools', () => ({
  useCreateToolMutation: jest.fn(() => [mockCreateTool, {}]),
}));

describe('CreateToolDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render dialog if open is false', () => {
    const result = render(
      <CreateToolDialog onClose={mockHandleClose} open={false} />
    );

    expect(result.queryByText('Create new tool')).toBeNull();
  });

  it('renders dialog title', () => {
    const result = render(<CreateToolDialog onClose={mockHandleClose} open />);

    expect(result.getByText('Create new tool')).toBeDefined();
  });

  it('does not call API to create tool if no tool name is provided', async () => {
    const result = render(<CreateToolDialog onClose={mockHandleClose} open />);

    const submitButton = result.getByText('Create tool');
    expect(() => userEvent.click(submitButton)).rejects.toThrow(
      /pointer-events: none/
    );

    await waitFor(() => {
      expect(mockCreateTool).not.toHaveBeenCalled();
    });
  });

  it('calls API to create tool on submit click', async () => {
    const mockName = 'New Tool Name';

    const result = render(<CreateToolDialog onClose={mockHandleClose} open />);

    const input = result.getByTestId('create-tool-dialog-input');
    await userEvent.type(input, mockName);

    const submitButton = result.getByText('Create tool');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTool).toHaveBeenCalledTimes(1);
      expect(mockCreateTool).toHaveBeenCalledWith({ name: mockName });
    });
  });

  it('does not navigate to new page', () => {
    (useCreateToolMutation as jest.Mock).mockImplementationOnce(() => [
      mockCreateTool,
      {},
    ]);

    render(<CreateToolDialog onClose={mockHandleClose} open />);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates to /editor/:id after successful creation of tool', async () => {
    const mockNewTool = { id: 'new-tool-id' };
    (useCreateToolMutation as jest.Mock).mockImplementationOnce(() => [
      mockCreateTool,
      { data: mockNewTool },
    ]);

    render(<CreateToolDialog onClose={mockHandleClose} open />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(`/editor/${mockNewTool.id}`);
    });
  });
});
