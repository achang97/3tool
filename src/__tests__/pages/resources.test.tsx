import ResourcesPage from '@app/pages/resources';
import { Resource } from '@app/types';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
];

jest.mock('@app/redux/services/resources', () => ({
  useGetResourcesQuery: jest.fn(() => ({ data: mockResources })),
}));

describe('Resources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title', () => {
    const result = render(<ResourcesPage />);

    expect(result.getByText('Resource Library')).toBeDefined();
  });

  it('renders resources as rows in data grid', () => {
    const result = render(<ResourcesPage />);

    // Check first row
    expect(result.getByText('Smart contract')).toBeDefined();
    expect(result.getByText('Staking Pool Contract')).toBeDefined();
    expect(
      result.getByText('(0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3)')
    ).toBeDefined();
    expect(result.getByText('Jan 5, 2023 2:37 AM')).toBeDefined();
    expect(result.getByText('3')).toBeDefined();
  });

  it('opens and closes edit dialog', async () => {
    const result = render(<ResourcesPage />);

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

  it('opens and closes create dialog', async () => {
    const result = render(<ResourcesPage />);

    const createButton = result.getByText('Add new resource');
    userEvent.click(createButton);
    expect(result.findByTestId('create-resource-dialog')).toBeDefined();

    userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(result.queryByTestId('create-resource-dialog')).toBeNull();
    });
  });
});
