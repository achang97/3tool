import { ResourceType } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { waitFor } from '@testing-library/dom';
import { mockValidAddress } from '@tests/constants/data';
import { completeContractForm, submitForm } from '@tests/utils/form';
import { render } from '@tests/utils/renderWithContext';
import { Abi } from 'abitype';
import { mainnet } from 'wagmi';
import { ConfigureResourceForm } from '../ConfigureResourceForm';

const mockFormId = 'form-id';
const mockHandleSubmit = jest.fn();

jest.mock('@app/utils/contracts');

describe('ConfigureResourceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle button group', () => {
    const result = render(
      <ConfigureResourceForm formId={mockFormId} onSubmit={mockHandleSubmit} />
    );

    expect(result.getByText('Smart contract')).toBeTruthy();
    expect(result.getByText('Blockchain API (Coming Soon)')).toBeTruthy();
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
      address: mockValidAddress,
    };

    await completeContractForm(result, contractFields);
    submitForm(result, mockFormId);

    await waitFor(() => {
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
});
