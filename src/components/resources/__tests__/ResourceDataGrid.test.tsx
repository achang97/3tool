import { Resource } from '@app/types';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { ResourceDataGrid } from '../ResourceDataGrid';

const mockResources: Resource[] = [
  {
    id: '1',
    type: 'smart_contract',
    name: 'Staking Pool Contract',
    createdAt: new Date('2023-01-05T02:37:30.083Z'),
    updatedAt: new Date('2023-01-05T02:37:30.083Z'),
    numLinkedQueries: 3,
    metadata: {
      smartContract: {
        chainId: 5,
        address: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
        abi: '[{"inputs":[{"internalType":"address","name":"contractLogic","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"}]',
        proxy: false,
      },
    },
  },
  {
    id: '2',
    type: 'dune',
    name: 'Dune API',
    createdAt: new Date('2023-01-05T02:33:30.083Z'),
    updatedAt: new Date('2023-01-05T02:33:30.083Z'),
    numLinkedQueries: 4,
    metadata: {},
  },
];

jest.mock('@app/redux/services/resources', () => ({
  useGetResourcesQuery: jest.fn(() => ({ data: mockResources })),
}));

describe('ResourceDataGrid', () => {
  it('queries resources with input value', async () => {
    const result = render(<ResourceDataGrid />);

    const input = result.getByTestId('resource-data-grid-search-input');

    await userEvent.type(input, 'abc');

    await waitFor(() => {
      expect(useGetResourcesQuery).toHaveBeenCalledWith('abc');
    });
  });

  it('renders columns', () => {
    const result = render(<ResourceDataGrid __test__disableVirtualization />);

    expect(result.getByText('Type')).toBeDefined();
    expect(result.getByText('Resource')).toBeDefined();
    expect(result.getByText('Created At')).toBeDefined();
    expect(result.getByText('Linked Queries')).toBeDefined();
  });

  it('renders resources as rows in data grid', () => {
    const result = render(<ResourceDataGrid __test__disableVirtualization />);

    // Check first row
    expect(result.getByText('Smart contract')).toBeDefined();
    expect(result.getByText('Staking Pool Contract')).toBeDefined();
    expect(
      result.getByText('(0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3)')
    ).toBeDefined();
    expect(result.getByText('Jan 4, 2023 6:37 PM')).toBeDefined();
    expect(result.getByText('3')).toBeDefined();

    // Check second row
    expect(result.getByText('Dune')).toBeDefined();
    expect(result.getByText('Dune API')).toBeDefined();
    expect(result.getByText('Jan 4, 2023 6:33 PM')).toBeDefined();
    expect(result.getByText('4')).toBeDefined();
  });

  it('opens and closes edit dialog', async () => {
    const result = render(<ResourceDataGrid __test__disableVirtualization />);

    const moreButtons = result.getAllByTestId('MoreVertIcon');
    userEvent.click(moreButtons[0]);

    const editButton = await result.findByText('Edit');
    userEvent.click(editButton);
    expect(result.findByTestId('edit-resource-dialog')).toBeDefined();

    userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(result.queryByTestId('edit-resource-dialog')).toBeNull();
    });
  });
});
