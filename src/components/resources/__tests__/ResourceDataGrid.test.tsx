import { Resource } from '@app/types';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { render } from '@tests/utils/renderWithContext';
import { store } from '@app/redux/store';
import { setActiveResource } from '@app/redux/features/resourcesSlice';
import { ResourceDataGrid } from '../ResourceDataGrid';

const dispatchSpy = jest.spyOn(store, 'dispatch');

const mockResources: Resource[] = [
  {
    id: '1',
    type: 'smart_contract',
    name: 'Staking Pool Contract',
    createdAt: '2023-01-05T02:37:30.083Z',
    updatedAt: '2023-01-05T02:37:30.083Z',
    numLinkedQueries: 3,
    metadata: {
      smartContract: {
        chainId: 5,
        address: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
        abi: '[{"inputs":[{"internalType":"address","name":"contractLogic","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"}]',
        isProxy: false,
      },
    },
  },
  {
    id: '2',
    type: 'dune',
    name: 'Dune API',
    createdAt: '2023-01-05T02:33:30.083Z',
    updatedAt: '2023-01-05T02:33:30.083Z',
    numLinkedQueries: 4,
    metadata: {},
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
    expect(result.getByText('Jan 5, 2023 2:37 AM')).toBeDefined();
    expect(result.getByText('3')).toBeDefined();

    // Check second row
    expect(result.getByText('Dune')).toBeDefined();
    expect(result.getByText('Dune API')).toBeDefined();
    expect(result.getByText('Jan 5, 2023 2:33 AM')).toBeDefined();
    expect(result.getByText('4')).toBeDefined();
  });

  it('opens and closes edit dialog', async () => {
    const result = render(<ResourceDataGrid __test__disableVirtualization />);

    const moreButtons = result.getAllByTestId('MoreVertIcon');
    userEvent.click(moreButtons[0]);

    const editButton = await result.findByText('Edit');
    userEvent.click(editButton);
    expect(await result.findByTestId('edit-resource-dialog')).toBeDefined();
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        setActiveResource(mockResources[0])
      );
    });

    userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(result.queryByTestId('edit-resource-dialog')).toBeNull();
      expect(dispatchSpy).toHaveBeenCalledWith(setActiveResource(undefined));
    });
  });
});
