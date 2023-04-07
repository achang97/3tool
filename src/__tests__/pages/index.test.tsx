import ToolsPage from '@app/pages';
import { mockUser } from '@tests/constants/data';
import { Tool } from '@app/types';
import { render } from '@tests/utils/renderWithContext';

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

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({})),
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

  it('renders tools', () => {
    const result = render(<ToolsPage />);
    expect(result.getByText('Tool 1')).toBeTruthy();
  });
});
