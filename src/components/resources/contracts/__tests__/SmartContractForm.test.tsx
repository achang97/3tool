import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { goerli, mainnet } from 'wagmi';
import { ResourceType } from '@app/types';
import { RESOURCE_DATA_TEMPLATES } from '@app/constants';
import { pushResource } from '@app/redux/features/resourcesSlice';
import { SmartContractForm } from '../SmartContractForm';
import { useAbiResources } from '../../hooks/useAbiResources';
import { useFetchAbi } from '../../hooks/useFetchAbi';

const mockDispatch = jest.fn();
const mockHandleDataChange = jest.fn();
const mockHandleNameChange = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../../hooks/useAbiResources');

jest.mock('../../hooks/useFetchAbi');

describe('SmartContractForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAbiResources as jest.Mock).mockImplementation(() => []);
    (useFetchAbi as jest.Mock).mockImplementation(() => ({ abi: '' }));
  });

  describe('name', () => {
    it('renders label', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Name/)).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByPlaceholderText('Enter contract name')).toBeTruthy();
    });

    it('renders value', () => {
      const mockName = 'name';
      const result = render(
        <SmartContractForm
          name={mockName}
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Name/)).toHaveDisplayValue(mockName);
    });

    it('calls onNameChange on value change', async () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      const mockValue = 'a';
      await userEvent.type(result.getByLabelText(/^Name/), mockValue);
      expect(mockHandleNameChange).toHaveBeenCalledWith(mockValue);
    });
  });

  describe('network', () => {
    it('renders label', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Network/)).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <SmartContractForm
          name=""
          // @ts-ignore Intentionally passing in undefined
          data={{ address: '', chainId: undefined, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByText('Select contract network')).toBeTruthy();
    });

    it('renders value', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(
        result.getByTestId('smart-contract-form-network-select')
      ).toHaveDisplayValue(mainnet.id.toString());
    });

    it('calls onDataChange on value change', async () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      await userEvent.click(result.getByLabelText(/^Network/));
      await userEvent.click(result.getByText(goerli.name));
      expect(mockHandleDataChange).toHaveBeenCalledWith({ chainId: goerli.id });
    });
  });

  describe('address', () => {
    it('renders label', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Address/)).toBeTruthy();
    });

    it('renders placeholder', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(
        result.getByPlaceholderText('Enter contract address')
      ).toBeTruthy();
    });

    it('renders value', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: 'address', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^Address/)).toHaveDisplayValue('address');
    });

    it('calls onDataChange on value change', async () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      const mockValue = 'a';
      await userEvent.type(result.getByLabelText(/^Address/), mockValue);
      expect(mockHandleDataChange).toHaveBeenCalledWith({ address: mockValue });
    });
  });

  describe('abi', () => {
    beforeEach(() => {
      (useAbiResources as jest.Mock).mockImplementation(() => [
        { _id: '1', name: 'abi1' },
      ]);
    });

    it('renders label', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByLabelText(/^ABI/)).toBeTruthy();
    });

    it('renders "Select contract ABI" placeholder', () => {
      const result = render(
        <SmartContractForm
          name=""
          // @ts-ignore Intentionally passing in undefined
          data={{ address: '', chainId: undefined, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByText('Select contract ABI')).toBeTruthy();
    });

    it('renders "No created ABIs" placeholder', () => {
      (useAbiResources as jest.Mock).mockImplementation(() => []);
      const result = render(
        <SmartContractForm
          name=""
          // @ts-ignore Intentionally passing in undefined
          data={{ address: '', chainId: undefined, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(result.getByText('No created ABIs')).toBeTruthy();
    });

    it('disables select when there are no abis', () => {
      (useAbiResources as jest.Mock).mockImplementation(() => []);
      const result = render(
        <SmartContractForm
          name=""
          // @ts-ignore Intentionally passing in undefined
          data={{ address: '', chainId: undefined, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(
        result.getByTestId('smart-contract-form-abi-select')
      ).toBeDisabled();
    });

    it('renders value', () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '1' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      expect(
        result.getByTestId('smart-contract-form-abi-select')
      ).toHaveDisplayValue('1');
    });

    it('calls onDataChange on value change', async () => {
      const result = render(
        <SmartContractForm
          name=""
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );
      await userEvent.click(result.getByLabelText(/^ABI/));
      await userEvent.click(result.getByText('abi1'));
      expect(mockHandleDataChange).toHaveBeenCalledWith({ abiId: '1' });
    });

    it('renders button to create new abi', async () => {
      const mockName = 'name';
      const mockAbi = 'abi';

      (useFetchAbi as jest.Mock).mockImplementation(() => ({ abi: mockAbi }));

      const result = render(
        <SmartContractForm
          name={mockName}
          data={{ address: '', chainId: mainnet.id, abiId: '' }}
          onDataChange={mockHandleDataChange}
          onNameChange={mockHandleNameChange}
        />
      );

      await userEvent.click(result.getByText('Create new ABI'));
      expect(mockDispatch).toHaveBeenCalledWith(
        pushResource({
          type: 'create',
          resource: {
            _id: '',
            name: `${mockName} ABI`,
            type: ResourceType.Abi,
            data: {
              abi: {
                ...RESOURCE_DATA_TEMPLATES.abi,
                abi: mockAbi,
              },
            },
            createdAt: '',
            updatedAt: '',
          },
        })
      );
    });
  });
});
