import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCreateToolMutation } from '@app/redux/services/tools';
import { ApiError } from '@app/types';
import { mockApiErrorResponse } from '@tests/constants/api';
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
  useCreateToolMutation: jest.fn(),
}));

describe('CreateToolDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateToolMutation as jest.Mock).mockImplementation(() => [mockCreateTool, {}]);
  });

  it('does not render dialog if isOpen is false', () => {
    render(<CreateToolDialog onClose={mockHandleClose} isOpen={false} />);

    expect(screen.queryByTestId('create-tool-dialog')).toBeNull();
  });

  it('renders dialog title', () => {
    render(<CreateToolDialog onClose={mockHandleClose} isOpen />);

    expect(screen.getByText('Create new app')).toBeTruthy();
  });

  it('disables button to create tool if no name is provided', async () => {
    render(<CreateToolDialog onClose={mockHandleClose} isOpen />);

    const submitButton = screen.getByText('Create app');
    expect(submitButton).toBeDisabled();
  });

  it('calls API to create tool on submit click', async () => {
    const mockName = 'New Tool Name';

    render(<CreateToolDialog onClose={mockHandleClose} isOpen />);

    const input = screen.getByTestId('create-tool-dialog-input');
    await userEvent.type(input, mockName);

    const submitButton = screen.getByText('Create app');
    await userEvent.click(submitButton);

    expect(mockCreateTool).toHaveBeenCalledWith({ name: mockName });
  });

  it('does not navigate to new page after failed creation of tool', async () => {
    mockCreateTool.mockImplementation(() => mockApiErrorResponse);

    render(<CreateToolDialog onClose={mockHandleClose} isOpen />);

    const input = screen.getByTestId('create-tool-dialog-input');
    await userEvent.type(input, 'New Tool Name');

    const submitButton = screen.getByText('Create app');
    await userEvent.click(submitButton);

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockHandleClose).not.toHaveBeenCalled();
  });

  it('navigates to /editor/:id and resets state after successful creation of tool', async () => {
    const mockNewTool = { _id: 'new-tool-id', name: 'new name' };
    mockCreateTool.mockImplementation(() => ({ unwrap: () => mockNewTool }));

    render(<CreateToolDialog onClose={mockHandleClose} isOpen />);

    const input = screen.getByTestId('create-tool-dialog-input');
    await userEvent.type(input, 'New Tool Name');

    const submitButton = screen.getByText('Create app');
    await userEvent.click(submitButton);

    expect(mockPush).toHaveBeenCalledWith(
      `/editor/${mockNewTool._id}/${encodeURIComponent(mockNewTool.name)}`
    );
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('renders error message after failed creation', () => {
    const mockError: ApiError = {
      status: 400,
      data: {
        message: 'Mock Error Message',
      },
    };
    (useCreateToolMutation as jest.Mock).mockImplementation(() => [
      mockCreateTool,
      { error: mockError },
    ]);

    render(<CreateToolDialog onClose={mockHandleClose} isOpen />);
    expect(screen.getByText('Mock Error Message')).toBeTruthy();
  });
});
