import ToolsPage from '@app/pages';
import { mockUser } from '@tests/constants/data';
import { Tool } from '@app/types';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { useGetToolsQuery } from '@app/redux/services/tools';
import { mockApiError } from '@tests/constants/api';

const mockTools: Tool[] = [
  {
    _id: '1',
    name: 'Tool 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorUser: mockUser,
    components: [],
    actions: [],
  },
];

jest.mock('@app/redux/services/tools', () => ({
  ...jest.requireActual('@app/redux/services/tools'),
  useGetToolsQuery: jest.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetToolsQuery as jest.Mock).mockImplementation(() => ({ data: mockTools }));
  });

  it('renders page title', () => {
    render(<ToolsPage />);
    expect(screen.getByText('Tools')).toBeTruthy();
  });

  it('renders loader', () => {
    (useGetToolsQuery as jest.Mock).mockImplementation(() => ({ isLoading: true }));
    render(<ToolsPage />);
    expect(screen.getByTestId('fullscreen-loader')).toBeTruthy();
  });

  it('renders error', () => {
    (useGetToolsQuery as jest.Mock).mockImplementation(() => ({ error: mockApiError }));
    render(<ToolsPage />);
    expect(screen.getByText(mockApiError.data.message)).toBeTruthy();
  });

  it('renders create tool thumbnail', async () => {
    render(<ToolsPage />);
    expect(screen.findByTestId('create-tool-thumbnail')).toBeDefined();
  });

  it('renders tools', () => {
    render(<ToolsPage />);
    expect(screen.getByText('Tool 1')).toBeTruthy();
  });
});
