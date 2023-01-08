import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/dom';
import { completeContractForm, submitForm } from '@tests/utils/form';
import { render } from '@tests/utils/renderWithContext';
import { Abi } from 'abitype';
import { mainnet } from 'wagmi';
import { ConfigureResourceForm } from '../ConfigureResourceForm';

const mockFormId = 'form-id';
const mockHandleSubmit = jest.fn();

jest.mock('@app/utils/contracts');

describe('ConfigureResourceForm', () => {
  it('renders toggle button group', () => {
    const result = render(
      <ConfigureResourceForm formId={mockFormId} onSubmit={mockHandleSubmit} />
    );

    expect(result.getByText('Smart contract')).toBeDefined();
    expect(result.getByText('Blockchain API (Coming Soon)')).toBeDefined();
  });

  it('calls onSubmit after completing smart contract form', async () => {
    const mockAbi: Abi = [];
    (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);

    const result = render(
      <ConfigureResourceForm formId={mockFormId} onSubmit={mockHandleSubmit} />
    );

    const contractFields = {
      name: 'Contract',
      chainId: mainnet.id,
      address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
    };

    await completeContractForm(result, contractFields);
    submitForm(result, mockFormId);

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
    });
  });
});
