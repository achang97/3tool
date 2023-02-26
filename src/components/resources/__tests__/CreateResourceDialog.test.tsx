import { useCreateResourceMutation } from '@app/redux/services/resources';
import { ApiError, ResourceType } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { mockValidAddress } from '@tests/constants/data';
import { completeContractForm } from '@tests/utils/form';
import { render } from '@tests/utils/renderWithContext';
import { Abi } from 'abitype';
import { mainnet } from 'wagmi';
import { CreateResourceDialog } from '../CreateResourceDialog';

const mockHandleClose = jest.fn();
const mockCreateResource = jest.fn();

jest.mock('@app/utils/contracts');

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useCreateResourceMutation: jest.fn(),
}));

describe('CreateResourceDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      {},
    ]);
  });

  it('does not render dialog', () => {
    const result = render(
      <CreateResourceDialog onClose={mockHandleClose} isOpen={false} />
    );
    expect(result.queryByTestId('create-resource-dialog')).toBeNull();
  });

  it('calls onClose when dialog is closed', async () => {
    render(<CreateResourceDialog onClose={mockHandleClose} isOpen />);

    await userEvent.keyboard('[Escape]');
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('renders title', () => {
    const result = render(
      <CreateResourceDialog onClose={mockHandleClose} isOpen />
    );
    expect(result.getByText('Add Resource')).toBeTruthy();
  });

  it('renders error message', () => {
    const mockError: ApiError = {
      status: 400,
      data: {
        message: 'Mock Error',
      },
    };

    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      { error: mockError },
    ]);

    const result = render(
      <CreateResourceDialog onClose={mockHandleClose} isOpen />
    );
    expect(result.getByText('Mock Error')).toBeTruthy();
  });

  it('calls onSubmit with smart contract resource on Save button click', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(
      <CreateResourceDialog onClose={mockHandleClose} isOpen />
    );
    const contractFields = {
      name: 'Contract',
      chainId: mainnet.id,
      address: mockValidAddress,
    };

    await completeContractForm(result, contractFields);
    await userEvent.click(result.getByText('Save'));

    expect(mockCreateResource).toHaveBeenCalledWith({
      type: ResourceType.SmartContract,
      name: contractFields.name,
      data: {
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
  });

  it('calls onClose on successful creation of resource', async () => {
    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      { data: {} },
    ]);

    render(<CreateResourceDialog onClose={mockHandleClose} isOpen />);

    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
