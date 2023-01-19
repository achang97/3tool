import { useCreateResourceMutation } from '@app/redux/services/resources';
import { ApiError, ResourceType } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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
      <CreateResourceDialog onClose={mockHandleClose} open={false} />
    );
    expect(result.queryByTestId('create-resource-dialog')).toBeNull();
  });

  it('calls onClose when dialog is closed', async () => {
    render(<CreateResourceDialog onClose={mockHandleClose} open />);

    await userEvent.keyboard('[Escape]');
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('renders title', () => {
    const result = render(
      <CreateResourceDialog onClose={mockHandleClose} open />
    );
    expect(result.getByText('Add Resource')).toBeDefined();
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
      <CreateResourceDialog onClose={mockHandleClose} open />
    );
    expect(result.getByText('Mock Error')).toBeDefined();
  });

  it('calls onSubmit with smart contract resource on Save button click', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(
      <CreateResourceDialog onClose={mockHandleClose} open />
    );
    const contractFields = {
      name: 'Contract',
      chainId: mainnet.id,
      address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
    };

    await completeContractForm(result, contractFields);
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
  });

  it('calls onClose on successful creation of resource', async () => {
    (useCreateResourceMutation as jest.Mock).mockImplementation(() => [
      mockCreateResource,
      { data: {} },
    ]);

    render(<CreateResourceDialog onClose={mockHandleClose} open />);

    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
