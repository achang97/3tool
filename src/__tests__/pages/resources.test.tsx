import ResourcesPage from '@app/pages/resources';
import {
  useCreateResourceMutation,
  useUpdateResourceMutation,
} from '@app/redux/services/resources';
import { Resource, ResourceType } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { completeContractForm } from '@tests/utils/form';
import { render } from '@tests/utils/renderWithContext';
import { Abi } from 'abitype';
import { goerli, mainnet } from 'wagmi';

const mockResources: Resource[] = [
  {
    id: '1',
    type: ResourceType.SmartContract,
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
];

const mockCreateResource = jest.fn();
const mockUpdateResource = jest.fn();

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useGetResourcesQuery: jest.fn(() => ({ data: mockResources })),
  useCreateResourceMutation: jest.fn(),
  useUpdateResourceMutation: jest.fn(),
}));

jest.mock('@app/utils/contracts');

describe('Resources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      {},
    ]);
    (useUpdateResourceMutation as jest.Mock).mockImplementation(() => [
      mockUpdateResource,
      {},
    ]);
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

  it('opens edit dialog and updates smart contract resource', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(<ResourcesPage />);

    const moreButtons = result.getAllByTestId('MoreVertIcon');
    await userEvent.click(moreButtons[0]);

    const editButton = await result.findByText('Edit');
    await userEvent.click(editButton);
    expect(await result.findByTestId('edit-resource-dialog')).toBeDefined();

    const contractFields = {
      name: '- Edited',
      chainId: goerli.id,
      isProxy: true,
      logicAddress: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
    };
    await completeContractForm(result, contractFields);

    (useUpdateResourceMutation as jest.Mock).mockImplementation(() => [
      mockUpdateResource,
      { data: {} },
    ]);
    await userEvent.click(result.getByText('Save'));
    expect(mockUpdateResource).toHaveBeenCalledWith({
      id: mockResources[0].id,
      type: ResourceType.SmartContract,
      name: `${mockResources[0].name}${contractFields.name}`,
      metadata: {
        smartContract: {
          chainId: contractFields.chainId,
          address: mockResources[0].metadata.smartContract?.address,
          abi: mockResources[0].metadata.smartContract?.abi,
          isProxy: contractFields.isProxy,
          logicAddress: contractFields.logicAddress,
          logicAbi: JSON.stringify(mockAbi),
        },
      },
    });

    result.rerender(<ResourcesPage />);
    await waitFor(() => {
      expect(result.queryByTestId('edit-resource-dialog')).toBeNull();
    });
  });

  it('opens create dialog and creates smart contract resource', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(<ResourcesPage />);

    const createButton = result.getByText('Add new resource');
    await userEvent.click(createButton);
    expect(await result.findByTestId('create-resource-dialog')).toBeDefined();

    const contractFields = {
      name: 'Contract',
      chainId: mainnet.id,
      address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
    };
    await completeContractForm(result, contractFields);

    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      { data: {} },
    ]);
    await userEvent.click(result.getByText('Save'));
    expect(mockCreateResource).toHaveBeenCalledWith({
      type: ResourceType.SmartContract,
      name: contractFields.name,
      metadata: {
        smartContract: {
          chainId: contractFields.chainId,
          address: contractFields.address,
          abi: JSON.stringify(mockAbi),
          isProxy: false,
          logicAddress: undefined,
          logicAbi: undefined,
        },
      },
    });

    result.rerender(<ResourcesPage />);
    await waitFor(() => {
      expect(result.queryByTestId('create-resource-dialog')).toBeNull();
    });
  });
});
