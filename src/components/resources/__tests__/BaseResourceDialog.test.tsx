import { ApiError, ResourceType } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import userEvent from '@testing-library/user-event';
import { completeContractForm } from '@tests/utils/form';
import { render } from '@tests/utils/renderWithContext';
import { Abi } from 'abitype';
import { mainnet } from 'wagmi';
import { BaseResourceDialog } from '../BaseResourceDialog';

const mockTitle = 'Dialog title';
const mockHandleSubmit = jest.fn();
const mockHandleClose = jest.fn();
const mockTestId = 'test-id';

jest.mock('@app/utils/contracts');

describe('BaseResourceDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render dialog', () => {
    const result = render(
      <BaseResourceDialog
        title={mockTitle}
        onClose={mockHandleClose}
        onSubmit={mockHandleSubmit}
        open={false}
        testId={mockTestId}
      />
    );
    expect(result.queryByTestId(mockTestId)).toBeNull();
  });

  it('calls onClose when dialog is closed', async () => {
    render(
      <BaseResourceDialog
        title={mockTitle}
        onClose={mockHandleClose}
        onSubmit={mockHandleSubmit}
        open
        testId={mockTestId}
      />
    );

    await userEvent.keyboard('[Escape]');
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('renders title', () => {
    const result = render(
      <BaseResourceDialog
        title={mockTitle}
        onClose={mockHandleClose}
        onSubmit={mockHandleSubmit}
        open
        testId={mockTestId}
      />
    );
    expect(result.getByText(mockTitle)).toBeTruthy();
  });

  it('renders error message', () => {
    const mockError: ApiError = {
      status: 400,
      data: {
        message: 'Mock Error',
      },
    };

    const result = render(
      <BaseResourceDialog
        title={mockTitle}
        onClose={mockHandleClose}
        onSubmit={mockHandleSubmit}
        open
        error={mockError}
        testId={mockTestId}
      />
    );
    expect(result.getByText('Mock Error')).toBeTruthy();
  });

  it('calls onSubmit with smart contract resource on Save button click', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(
      <BaseResourceDialog
        title={mockTitle}
        onClose={mockHandleClose}
        onSubmit={mockHandleSubmit}
        open
        testId={mockTestId}
      />
    );
    const contractFields = {
      name: 'Contract',
      chainId: mainnet.id,
      address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
    };

    await completeContractForm(result, contractFields);
    await userEvent.click(result.getByText('Save'));

    expect(mockHandleSubmit).toHaveBeenCalledWith({
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
});
