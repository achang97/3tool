import { useAppSelector } from '@app/redux/hooks';
import { ResourceType } from '@app/types';
import { getContractAbi } from '@app/utils/contracts';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockProxySmartContractResource } from '@tests/constants/data';
import { submitForm } from '@tests/utils/form';
import { Abi } from 'abitype';
import { goerli, mainnet } from 'wagmi';
import { ConfigureContractForm } from '../ConfigureContractForm';

const mockFormId = 'form-id';
const mockHandleSubmit = jest.fn();

jest.mock('@app/redux/hooks');
jest.mock('@app/utils/contracts');

describe('ConfigureContractForm', () => {
  const networkSelectId = 'configure-contract-form-network-select';
  const proxyCheckboxId = 'configure-contract-form-proxy-checkbox';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
    (getContractAbi as jest.Mock).mockImplementation(() => []);
  });

  it('renders form with given form id', () => {
    const result = render(
      <ConfigureContractForm formId={mockFormId} onSubmit={mockHandleSubmit} />
    );

    expect(result.container.querySelector(`#${mockFormId}`)).toBeTruthy();
  });

  describe('edit mode', () => {
    beforeEach(() => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        activeResource: mockProxySmartContractResource,
      }));
    });

    it('prefills fields with active resource', () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      expect(result.getByLabelText(/^Name/)).toHaveValue(
        mockProxySmartContractResource.name
      );
      expect(result.getByTestId(networkSelectId)).toHaveValue(
        mockProxySmartContractResource.data.smartContract?.chainId.toString()
      );
      expect(result.getByLabelText(/^Address/)).toHaveValue(
        mockProxySmartContractResource.data.smartContract?.address
      );
      expect(result.getByLabelText(/^ABI/)).toHaveValue(
        mockProxySmartContractResource.data.smartContract?.abi
      );
      expect(result.getByTestId(proxyCheckboxId)).toHaveProperty(
        'checked',
        mockProxySmartContractResource.data.smartContract?.isProxy
      );
      expect(result.getByLabelText(/^Logic Address/)).toHaveValue(
        mockProxySmartContractResource.data.smartContract?.logicAddress
      );
      expect(result.getByLabelText(/^Logic ABI/)).toHaveValue(
        mockProxySmartContractResource.data.smartContract?.logicAbi
      );
    });

    it('does not fetch ABIs', () => {
      render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      expect(getContractAbi).not.toHaveBeenCalled();
    });
  });

  describe('conditional rendering', () => {
    it('does not render secondary inputs if address and ABI are not supplied', () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      expect(result.getByText(/^This is a proxy contract/)).not.toBeVisible();
      expect(result.getByLabelText(/^Logic Address/)).not.toBeVisible();
      expect(result.getByLabelText(/^Logic ABI/)).not.toBeVisible();
    });

    it('renders proxy checkbox if address and ABI are supplied', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(
        result.getByLabelText(/^Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );

      expect(result.getByText(/^This is a proxy contract/)).toBeVisible();
      expect(result.getByLabelText(/^Logic Address/)).not.toBeVisible();
      expect(result.getByLabelText(/^Logic ABI/)).not.toBeVisible();
    });

    it('renders logic contract inputs if proxy checkbox is checked', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(
        result.getByLabelText(/^Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );
      await userEvent.click(result.getByText(/^This is a proxy contract/));

      const logicAddressInput = result.getByLabelText(/^Logic Address/);
      await waitFor(() => {
        expect(logicAddressInput).toBeVisible();
      });

      await userEvent.type(
        logicAddressInput,
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );

      await waitFor(() => {
        expect(result.getByLabelText(/^Logic ABI/)).toBeVisible();
      });
    });
  });

  describe('ABI fetching', () => {
    describe('error', () => {
      const mockError = 'Error';

      beforeEach(() => {
        (getContractAbi as jest.Mock).mockImplementation(() => {
          throw new Error(mockError);
        });
      });

      it('displays fetch error for address field', async () => {
        const result = render(
          <ConfigureContractForm
            formId={mockFormId}
            onSubmit={mockHandleSubmit}
          />
        );

        await userEvent.type(
          result.getByLabelText(/^Address/),
          '0xf33Cb58287017175CADf990c9e4733823704aA86'
        );
        expect(result.getByText(mockError)).toBeTruthy();
      });

      it('displays fetch error for logic address field', async () => {
        const result = render(
          <ConfigureContractForm
            formId={mockFormId}
            onSubmit={mockHandleSubmit}
          />
        );

        await userEvent.type(
          result.getByLabelText(/^Logic Address/),
          '0xf33Cb58287017175CADf990c9e4733823704aA86'
        );
        expect(result.getByText(mockError)).toBeTruthy();
      });
    });

    describe('updates', () => {
      const mockAbi: Abi = [
        {
          stateMutability: 'payable',
          type: 'function',
          inputs: [],
          name: 'Random Function',
          outputs: [],
        },
      ];

      beforeEach(() => {
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          activeResource: mockProxySmartContractResource,
        }));
        (getContractAbi as jest.Mock).mockImplementation(() => mockAbi);
      });

      it('updates ABI when address is changed', async () => {
        const result = render(
          <ConfigureContractForm
            formId={mockFormId}
            onSubmit={mockHandleSubmit}
          />
        );

        const addressInput = result.getByLabelText(/^Address/);
        await userEvent.clear(addressInput);
        await userEvent.type(
          addressInput,
          '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3'
        );

        expect(getContractAbi).toHaveBeenCalledTimes(1);
        expect(result.getByLabelText(/^ABI/)).toHaveValue(
          JSON.stringify(mockAbi, null, 2)
        );
      });

      it('updates logic ABI when logic address is changed', async () => {
        const result = render(
          <ConfigureContractForm
            formId={mockFormId}
            onSubmit={mockHandleSubmit}
          />
        );

        const logicAddressInput = result.getByLabelText(/^Logic Address/);
        await userEvent.clear(logicAddressInput);
        await userEvent.type(
          logicAddressInput,
          '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3'
        );

        expect(getContractAbi).toHaveBeenCalledTimes(1);
        expect(result.getByLabelText(/^Logic ABI/)).toHaveValue(
          JSON.stringify(mockAbi, null, 2)
        );
      });

      it('updates ABI and logic ABI when chainId is changed', async () => {
        const result = render(
          <ConfigureContractForm
            formId={mockFormId}
            onSubmit={mockHandleSubmit}
          />
        );

        await userEvent.click(result.getByLabelText(/^Network/));
        await userEvent.click(await result.findByText(mainnet.name));

        expect(getContractAbi).toHaveBeenCalledTimes(2);
        expect(result.getByLabelText(/^ABI/)).toHaveValue(
          JSON.stringify(mockAbi, null, 2)
        );
        expect(result.getByLabelText(/^Logic ABI/)).toHaveValue(
          JSON.stringify(mockAbi, null, 2)
        );
      });
    });
  });

  describe('submit', () => {
    it('does not call onSubmit if name is not supplied', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      submitForm(result, mockFormId);
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if address is invalid', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(result.getByLabelText(/^Name/), 'New Contract');
      await userEvent.type(
        result.getByLabelText(/^Address/),
        'Invalid Contract'
      );

      submitForm(result, mockFormId);
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if ABI is invalid', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(result.getByLabelText(/^Name/), 'New Contract');
      await userEvent.type(
        result.getByLabelText(/^Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );
      await userEvent.type(result.getByLabelText(/^ABI/), 'Invalid JSON');

      submitForm(result, mockFormId);
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if logic address is invalid', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(result.getByLabelText(/^Name/), 'New Contract');
      await userEvent.type(
        result.getByLabelText(/^Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );

      await userEvent.click(result.getByTestId(proxyCheckboxId));
      await userEvent.type(
        result.getByLabelText(/^Logic Address/),
        'Invalid Address'
      );

      submitForm(result, mockFormId);
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit if logic ABI is invalid', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(result.getByLabelText(/^Name/), 'New Contract');
      await userEvent.type(
        result.getByLabelText(/^Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );

      await userEvent.click(result.getByTestId(proxyCheckboxId));
      await userEvent.type(
        result.getByLabelText(/^Logic Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );
      await userEvent.type(result.getByLabelText(/^Logic ABI/), 'Invalid JSON');

      submitForm(result, mockFormId);
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with logic contract information', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(result.getByLabelText(/^Name/), 'New Contract');

      await userEvent.click(result.getByLabelText(/^Network/));
      await userEvent.click(await result.findByText(goerli.name));

      await userEvent.type(
        result.getByLabelText(/^Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );

      await userEvent.click(result.getByTestId(proxyCheckboxId));
      await userEvent.type(
        result.getByLabelText(/^Logic Address/),
        '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3'
      );

      submitForm(result, mockFormId);
      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledWith({
          type: ResourceType.SmartContract,
          name: 'New Contract',
          data: {
            smartContract: {
              chainId: goerli.id,
              address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
              abi: '[]',
              isProxy: true,
              logicAddress: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
              logicAbi: '[]',
            },
          },
        });
      });
    });

    it('calls onSubmit without logic contract information', async () => {
      const result = render(
        <ConfigureContractForm
          formId={mockFormId}
          onSubmit={mockHandleSubmit}
        />
      );

      await userEvent.type(result.getByLabelText(/^Name/), 'New Contract');

      await userEvent.click(result.getByLabelText(/^Network/));
      await userEvent.click(await result.findByText(goerli.name));

      await userEvent.type(
        result.getByLabelText(/^Address/),
        '0xf33Cb58287017175CADf990c9e4733823704aA86'
      );

      submitForm(result, mockFormId);
      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledWith({
          type: ResourceType.SmartContract,
          name: 'New Contract',
          data: {
            smartContract: {
              chainId: goerli.id,
              address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
              abi: '[]',
              isProxy: false,
              logicAddress: undefined,
              logicAbi: undefined,
            },
          },
        });
      });
    });
  });
});
