import { Resource } from '@app/types';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { render } from '@tests/utils/renderWithContext';
import { mockSmartContractResource } from '@tests/constants/data';
import { ResourceDataGrid } from '../ResourceDataGrid';

const mockResources: Resource[] = [
  {
    ...mockSmartContractResource,
    createdAt: '2023-01-05T02:37:30.083Z',
  },
];

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useGetResourcesQuery: jest.fn(() => ({ data: mockResources })),
}));

describe('ResourceDataGrid', () => {
  it('queries resources with input value', async () => {
    const result = render(<ResourceDataGrid />);

    const input = result.getByTestId('resource-data-grid-search-input');

    await userEvent.type(input, 'abc');

    await waitFor(() => {
      expect(useGetResourcesQuery).toHaveBeenCalledWith('abc', {
        refetchOnMountOrArgChange: true,
      });
    });
  });

  it('renders columns', () => {
    const result = render(<ResourceDataGrid />);

    expect(result.getByText('Type')).toBeTruthy();
    expect(result.getByText('Resource')).toBeTruthy();
    expect(result.getByText('Created At')).toBeTruthy();
  });

  it('renders resources as rows in data grid', () => {
    const result = render(<ResourceDataGrid />);

    // Check first row
    expect(result.getByText('Smart contract')).toBeTruthy();
    expect(result.getByText(mockResources[0].name)).toBeTruthy();
    expect(
      result.getByText(`(${mockResources[0].data.smartContract?.address})`)
    ).toBeTruthy();
    expect(result.getByText('Jan 5, 2023 2:37 AM')).toBeTruthy();
  });
});
