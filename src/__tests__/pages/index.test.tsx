import userEvent from '@testing-library/user-event';
import ToolsPage from '@app/pages';
import { mockUser } from '@tests/constants/data';
import { Tool } from '@app/types';
import { render } from '@tests/utils/renderWithContext';

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Tool 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorUser: mockUser,
    components: [],
    actions: [],
  },
];

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock('@app/redux/services/tools', () => ({
  ...jest.requireActual('@app/redux/services/tools'),
  useGetToolsQuery: jest.fn(() => ({ data: mockTools })),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title', () => {
    const result = render(<ToolsPage />);
    expect(result.getByText('Tools')).toBeTruthy();
  });

  it('renders create tool thumbnail', async () => {
    const result = render(<ToolsPage />);
    expect(result.findByTestId('create-tool-thumbnail')).toBeDefined();
  });

  it('renders tools and navigates to the /tools/:id page on click', async () => {
    const result = render(<ToolsPage />);
    await userEvent.click(result.getByText('Tool 1'));
    expect(mockPush).toHaveBeenCalledWith('/tools/1');
  });
});
