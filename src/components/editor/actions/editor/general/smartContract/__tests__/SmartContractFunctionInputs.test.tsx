import { validateTextField } from '@tests/testers/inspector';
import { SmartContractAbiFunction, getAbiFieldType } from '@app/utils/abi';
import { render } from '@tests/utils/renderWithContext';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCodeMirrorPreview } from '@app/components/editor/hooks/useCodeMirrorPreview';
import { SmartContractFunctionInputs } from '../SmartContractFunctionInputs';

const mockHandleActiveFunctionChange = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview');

describe('SmartContractFunctionInputs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('inputs', () => {
    it('renders a text field for each function argument', async () => {
      render(
        <SmartContractFunctionInputs
          abiFunctions={
            [
              {
                name: 'function1',
                stateMutability: 'nonpayable',
                inputs: [
                  { name: 'arg1', type: 'string' },
                  { name: '', type: 'string' },
                ],
              },
            ] as SmartContractAbiFunction[]
          }
          activeFunction={{ name: 'function1', args: ['1'], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
        />
      );
      expect(screen.getByText('arg1 (string)')).toBeTruthy();
      expect(screen.getByText('N/A (string)')).toBeTruthy();
    });

    it('renders the arg at corresponding index as value', () => {
      render(
        <SmartContractFunctionInputs
          abiFunctions={
            [
              {
                name: 'function1',
                stateMutability: 'nonpayable',
                inputs: [{ name: 'arg1', type: 'bytes32' }],
              },
            ] as SmartContractAbiFunction[]
          }
          activeFunction={{ name: 'function1', args: ['1'], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
        />
      );
      expect(screen.getByRole('textbox')).toHaveTextContent('1');
    });

    it('updates the arg at corresponding index', async () => {
      render(
        <SmartContractFunctionInputs
          abiFunctions={
            [
              {
                name: 'function1',
                stateMutability: 'nonpayable',
                inputs: [
                  { name: 'arg1', type: 'bytes32' },
                  { name: '', type: 'string' },
                ],
              },
            ] as SmartContractAbiFunction[]
          }
          activeFunction={{ name: 'function1', args: ['', ''], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
        />
      );
      await userEvent.type(screen.getAllByRole('textbox')[0], '1');
      expect(mockHandleActiveFunctionChange).toHaveBeenCalledWith({
        args: ['1', ''],
      });
    });

    it('displays preview with correct field type', () => {
      render(
        <SmartContractFunctionInputs
          abiFunctions={
            [
              {
                name: 'function1',
                stateMutability: 'nonpayable',
                inputs: [{ name: 'arg1', type: 'uint32' }],
              },
            ] as SmartContractAbiFunction[]
          }
          activeFunction={{ name: 'function1', args: ['1'], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
        />
      );
      expect(useCodeMirrorPreview as jest.Mock).toHaveBeenCalledWith({
        type: getAbiFieldType('uint32'),
        isDynamic: true,
        expression: '1',
      });
    });
  });

  describe('payable amount', () => {
    it('does not render text field if function is not payable', () => {
      render(
        <SmartContractFunctionInputs
          abiFunctions={
            [{ name: 'function1', stateMutability: 'nonpayable' }] as SmartContractAbiFunction[]
          }
          activeFunction={{ name: 'function1', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
        />
      );
      expect(screen.queryByText('payableAmount (ETH)')).toBeNull();
    });

    it('renders text field if function is payable', async () => {
      render(
        <SmartContractFunctionInputs
          abiFunctions={
            [{ name: 'function1', stateMutability: 'payable' }] as SmartContractAbiFunction[]
          }
          activeFunction={{ name: 'function1', args: [], payableAmount: '1' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
        />
      );
      await validateTextField(undefined, {
        field: 'payableAmount',
        label: 'payableAmount (ETH)',
        value: '1',
        onChange: mockHandleActiveFunctionChange,
        data: {
          type: 'number',
        },
      });
    });
  });
});
