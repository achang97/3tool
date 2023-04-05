import ResourcesPage from '@app/pages/resources';
import { render } from '@tests/utils/renderWithContext';

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useGetResourcesQuery: jest.fn(() => ({ data: [] })),
}));

describe('Resources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title', () => {
    const result = render(<ResourcesPage />);
    expect(result.getByText('Resource Library')).toBeTruthy();
  });

  it('renders button to create resource', () => {
    const result = render(<ResourcesPage />);
    expect(result.getByTestId('create-resource-button')).toBeTruthy();
  });

  it('renders resource data grid', () => {
    const result = render(<ResourcesPage />);
    expect(result.getByTestId('resource-data-grid')).toBeTruthy();
  });

  it('renders resource modals', () => {
    const result = render(<ResourcesPage />);
    expect(result.getByTestId('resource-modals')).toBeTruthy();
  });
});
