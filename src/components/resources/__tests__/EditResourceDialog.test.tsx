import { useUpdateResourceMutation } from '@app/redux/services/resources';
import { ApiError, ResourceType } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { mockValidAddress } from '@tests/constants/data';
import { completeContractForm } from '@tests/utils/form';
import { render } from '@tests/utils/renderWithContext';
import { Abi } from 'abitype';
import { mainnet } from 'wagmi';
import { EditResourceDialog } from '../EditResourceDialog';

const mockResourceId = 'resource-id';

const mockHandleClose = jest.fn();
const mockUpdateResource = jest.fn();

jest.mock('@app/utils/contracts');

jest.mock('@app/redux/services/resources', () => ({
  ...jest.requireActual('@app/redux/services/resources'),
  useUpdateResourceMutation: jest.fn(),
}));

describe('EditResourceDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateResourceMutation as jest.Mock).mockImplementation(() => [
      mockUpdateResource,
      {},
    ]);
  });

  it('does not render dialog', () => {
    const result = render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        isOpen={false}
      />
    );
    expect(result.queryByTestId('create-resource-dialog')).toBeNull();
  });

  it('calls onClose when dialog is closed', async () => {
    render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        isOpen
      />
    );

    await userEvent.keyboard('[Escape]');
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('renders title', () => {
    const result = render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        isOpen
      />
    );
    expect(result.getByText('Edit Resource')).toBeTruthy();
  });

  it('renders error message', () => {
    const mockError: ApiError = {
      status: 400,
      data: {
        message: 'Mock Error',
      },
    };

    (useUpdateResourceMutation as jest.Mock).mockImplementation(() => [
      mockUpdateResource,
      { error: mockError },
    ]);

    const result = render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        isOpen
      />
    );
    expect(result.getByText('Mock Error')).toBeTruthy();
  });

  it('calls onSubmit with smart contract resource on Save button click', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        isOpen
      />
    );
    const contractFields = {
      name: 'Contract',
      chainId: mainnet.id,
      address: mockValidAddress,
    };

    await completeContractForm(result, contractFields);
    await userEvent.click(result.getByText('Save'));

    expect(mockUpdateResource).toHaveBeenCalledWith({
      id: mockResourceId,
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
    (useUpdateResourceMutation as jest.Mock).mockImplementation(() => [
      mockUpdateResource,
      { data: {} },
    ]);

    render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        isOpen
      />
    );

    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
