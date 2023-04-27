import ResourcesPage from '@app/pages/resources';
import { screen } from '@testing-library/react';
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
    render(<ResourcesPage />);
    expect(screen.getByText('Resource Library')).toBeTruthy();
  });

  it('renders button to create resource', () => {
    render(<ResourcesPage />);
    expect(screen.getByTestId('create-resource-button')).toBeTruthy();
  });

  it('renders resource data grid', () => {
    render(<ResourcesPage />);
    expect(screen.getByTestId('resource-data-grid')).toBeTruthy();
  });

  it('renders resource modals', () => {
    render(<ResourcesPage />);
    expect(screen.getByTestId('resource-dialogs')).toBeTruthy();
  });
});
