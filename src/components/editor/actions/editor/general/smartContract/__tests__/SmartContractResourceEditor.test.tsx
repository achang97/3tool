import { ResourceType, SmartContractBaseData } from '@app/types';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { validateSelectField, validateTextField } from '@tests/testers/inspector';
import { ACTION_DATA_TYPES } from '@app/constants';
import { SmartContractResourceEditor } from '../SmartContractResourceEditor';

const mockHandleDataChange = jest.fn();

const mockSmartContractResources = [
  {
    _id: '1',
    type: ResourceType.SmartContract,
    name: 'Smart Contract 1',
    data: {
      smartContract: {
        address: '0x123',
      },
    },
  },
  {
    _id: '2',
    type: ResourceType.SmartContract,
    name: 'Smart Contract 2',
    data: {
      smartContract: {
        address: '0x123',
      },
    },
  },
];

const mockAbiResources = [
  {
    _id: '3',
    type: ResourceType.Abi,
    name: 'ABI 1',
  },
  {
    _id: '4',
    type: ResourceType.Abi,
    name: 'ABI 2',
  },
];

jest.mock('@app/components/resources/hooks/useSmartContractResources', () => ({
  useSmartContractResources: jest.fn(() => mockSmartContractResources),
}));

jest.mock('@app/components/resources/hooks/useAbiResources', () => ({
  useAbiResources: jest.fn(() => mockAbiResources),
}));

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview');

describe('SmartContractResourceEditor', () => {
  describe('smart contract resource', () => {
    describe('smart contract id', () => {
      it('renders select for smart contract', async () => {
        render(
          <SmartContractResourceEditor
            data={{ freeform: false, smartContractId: '1' } as SmartContractBaseData}
            onDataChange={mockHandleDataChange}
          />
        );
        await validateSelectField(undefined, {
          field: 'smartContractId',
          label: /Smart contract/,
          testId: 'smart-contract-resource-editor-contract-select',
          value: '1',
          onChange: mockHandleDataChange,
          data: {
            options: mockSmartContractResources.map((smartContract) => ({
              label: `${smartContract.name} (${smartContract.data.smartContract.address})`,
              value: smartContract._id,
            })),
          },
        });
      });

      it('renders "Select smart contract" placeholder', () => {
        render(
          <SmartContractResourceEditor
            data={{ freeform: false, smartContractId: '' } as SmartContractBaseData}
            onDataChange={mockHandleDataChange}
          />
        );
        expect(screen.getByText('Select smart contract')).toBeTruthy();
      });
    });

    it('does not render freeform fields', () => {
      render(
        <SmartContractResourceEditor
          data={{ freeform: false, smartContractId: '' } as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
        />
      );
      expect(screen.queryByTestId('inspector-text-field-Network')).toBeNull();
      expect(screen.queryByTestId('inspector-text-field-ABI')).toBeNull();
    });
  });

  describe('freeform', () => {
    describe('address', () => {
      it('renders text field', async () => {
        render(
          <SmartContractResourceEditor
            data={{ freeform: true, freeformAddress: '0x123' } as SmartContractBaseData}
            onDataChange={mockHandleDataChange}
          />
        );
        await validateTextField(undefined, {
          field: 'freeformAddress',
          label: 'Smart contract',
          testId: 'smart-contract-resource-editor-contract-select',
          value: '0x123',
          onChange: mockHandleDataChange,
          data: {
            type: ACTION_DATA_TYPES.smartContractRead.freeformAddress,
          },
        });
      });
    });

    describe('chain ID', () => {
      it('renders text field', async () => {
        render(
          <SmartContractResourceEditor
            data={{ freeform: true, freeformChainId: '5' } as SmartContractBaseData}
            onDataChange={mockHandleDataChange}
          />
        );
        await validateTextField(undefined, {
          field: 'freeformChainId',
          label: 'Network',
          value: '5',
          onChange: mockHandleDataChange,
          data: {
            type: ACTION_DATA_TYPES.smartContractRead.freeformChainId,
          },
        });
      });

      it('renders "{{ chains.mainnet }}" placeholder', () => {
        render(
          <SmartContractResourceEditor
            data={{ freeform: true, freeformChainId: '' } as SmartContractBaseData}
            onDataChange={mockHandleDataChange}
          />
        );
        expect(screen.getByText('{{ chains.mainnet }}')).toBeTruthy();
      });
    });

    describe('ABI', () => {
      it('renders select', async () => {
        render(
          <SmartContractResourceEditor
            data={{ freeform: true, freeformAbiId: '3' } as SmartContractBaseData}
            onDataChange={mockHandleDataChange}
          />
        );
        await validateSelectField(undefined, {
          field: 'freeformAbiId',
          label: 'ABI',
          value: '3',
          onChange: mockHandleDataChange,
          data: {
            options: mockAbiResources.map((abi) => ({
              label: abi.name,
              value: abi._id,
            })),
          },
        });
      });

      it('renders "Select ABI" placeholder', () => {
        render(
          <SmartContractResourceEditor
            data={{ freeform: true, freeformAbiId: '' } as SmartContractBaseData}
            onDataChange={mockHandleDataChange}
          />
        );
        expect(screen.getByText('Select ABI')).toBeTruthy();
      });
    });
  });

  it('renders create resource button', () => {
    render(
      <SmartContractResourceEditor
        data={{ freeform: false, smartContractId: '1' } as SmartContractBaseData}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByTestId('create-resource-button')).toBeTruthy();
  });
});
