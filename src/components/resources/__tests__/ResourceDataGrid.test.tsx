import { ResourceWithLinkedActions } from '@app/types';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { render } from '@tests/utils/renderWithContext';
import { mockSmartContractResource } from '@tests/constants/data';
import { mockApiError } from '@tests/constants/api';
import { ResourceDataGrid } from '../ResourceDataGrid';

const mockResources: ResourceWithLinkedActions[] = [
  {
    ...mockSmartContractResource,
    createdAt: '2023-01-05T02:37:30.083Z',
  },
];

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useGetResourcesQuery: jest.fn(),
}));

describe('ResourceDataGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({ data: mockResources }));
  });

  it('queries resources with input value', async () => {
    render(<ResourceDataGrid />);

    const input = screen.getByTestId('resource-data-grid-search-input');

    await userEvent.type(input, 'abc');

    await waitFor(() => {
      expect(useGetResourcesQuery).toHaveBeenCalledWith('abc', {
        refetchOnMountOrArgChange: true,
      });
    });
  });

  it('renders columns', () => {
    render(<ResourceDataGrid />);

    expect(screen.getByText('Type')).toBeTruthy();
    expect(screen.getByText('Resource')).toBeTruthy();
    expect(screen.getByText('Created At')).toBeTruthy();
    expect(screen.getByText('Linked Actions')).toBeTruthy();
  });

  it('renders resources as rows in data grid', () => {
    render(<ResourceDataGrid />);

    // Check first row
    expect(screen.getByText('Smart contract')).toBeTruthy();
    expect(screen.getByText(mockResources[0].name)).toBeTruthy();
    expect(screen.getByText(`(${mockResources[0].data.smartContract?.address})`)).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('Jan 5, 2023 2:37 AM')).toBeTruthy();
  });

  it('renders empty placeholder', () => {
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({ data: [] }));
    render(<ResourceDataGrid />);
    expect(screen.getByText('No resources')).toBeTruthy();
  });

  it('renders error', () => {
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({ error: mockApiError }));
    render(<ResourceDataGrid />);
    expect(screen.getByText(mockApiError.data.message)).toBeTruthy();
  });
});
