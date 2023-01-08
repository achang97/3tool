import { useUpdateResourceMutation } from '@app/redux/services/resources';
import { ApiError } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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
        open={false}
      />
    );
    expect(result.queryByTestId('create-resource-dialog')).toBeNull();
  });

  it('calls onClose when dialog is closed', async () => {
    render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        open
      />
    );

    userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

  it('renders title', () => {
    const result = render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        open
      />
    );
    expect(result.getByText('Edit Resource')).toBeDefined();
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
        open
      />
    );
    expect(result.getByText('Mock Error')).toBeDefined();
  });

  it('calls onSubmit with smart contract resource and onClose on Save button click', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(
      <EditResourceDialog
        resourceId={mockResourceId}
        onClose={mockHandleClose}
        open
      />
    );
    const contractFields = {
      name: 'Contract',
      chainId: mainnet.id,
      address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
    };

    await completeContractForm(result, contractFields);
    userEvent.click(result.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdateResource).toHaveBeenCalledWith({
        id: mockResourceId,
        type: 'smart_contract',
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
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
