import { ApiError } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/dom';
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

    userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
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
    expect(result.getByText(mockTitle)).toBeDefined();
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
    expect(result.getByText('Mock Error')).toBeDefined();
  });

  it('calls onSubmit and onClose on click of Save button', async () => {
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
    userEvent.click(result.getByText('Save'));

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        type: 'smart_contract',
        name: contractFields.name,
        metadata: {
          smartContract: {
            chainId: mainnet.id,
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
