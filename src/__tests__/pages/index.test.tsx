import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tool } from '@app/types';
import ToolsPage from '@app/pages';

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Tool 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    creator: { name: 'Andrew Chang' },
  },
  {
    id: '2',
    name: 'Tool 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    creator: { name: 'Andrew Chang' },
  },
];

const mockNewTool: Tool = {
  id: '3',
  name: 'Tool 3',
  createdAt: new Date(),
  updatedAt: new Date(),
  creator: { name: 'Andrew Chang' },
};

const mockPush = jest.fn();
const mockCreateTool = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock('@app/redux/services/tools', () => ({
  useGetToolsQuery: jest.fn(() => ({ data: mockTools })),
  useCreateToolMutation: jest.fn(() => [mockCreateTool, { data: mockNewTool }]),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title', () => {
    const result = render(<ToolsPage />);

    expect(result.getByText('Tools')).toBeDefined();
  });

  it('renders create tool thumbnail and navigates to /editor/:id page on successful creation', async () => {
    const mockName = 'New Tool Name';

    const result = render(<ToolsPage />);

    const createThumbnailText = result.getByText('New tool');
    userEvent.click(createThumbnailText);

    const input = await result.findByTestId('create-tool-dialog-input');
    await userEvent.type(input, mockName);

    const submitButton = result.getByText('Create tool');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTool).toHaveBeenCalledTimes(1);
      expect(mockCreateTool).toHaveBeenCalledWith({ name: mockName });
    });

    expect(mockPush).toHaveBeenCalledWith(`/editor/${mockNewTool.id}`);
  });

  it('renders tools and navigates to the /tools/:id page on click', async () => {
    const result = render(<ToolsPage />);

    const toolOne = result.getByText('Tool 1');
    userEvent.click(toolOne);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/tools/1');
    });

    const toolTwo = result.getByText('Tool 2');
    userEvent.click(toolTwo);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/tools/2');
    });
  });
});
