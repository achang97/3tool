import { ActionType, SmartContractBaseData } from '@app/types';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { SmartContractFunctionEditor } from '../SmartContractFunctionEditor';

const mockHandleDataChange = jest.fn();
const mockHandleActiveFunctionIndexChange = jest.fn();

jest.mock('@app/components/editor/hooks/useActionSmartContract', () => ({
  useActionSmartContract: jest.fn(() => () => ({
    abi: [
      {
        type: 'function',
        name: 'read1',
        inputs: [{ name: 'arg1', type: 'string' }],
        stateMutability: 'pure',
      },
      {
        type: 'function',
        name: 'read2',
        inputs: [{ name: 'arg1', type: 'string' }],
        stateMutability: 'pure',
      },
      {
        type: 'function',
        name: 'write1',
        inputs: [{ name: 'arg1', type: 'string' }],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'write2',
        inputs: [{ name: 'arg1', type: 'string' }],
        stateMutability: 'nonpayable',
      },
    ],
  })),
}));

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview');

describe('SmartContractFunctionEditor', () => {
  describe('tabs', () => {
    it('displays tabs if read type', () => {
      render(
        <SmartContractFunctionEditor
          type={ActionType.SmartContractRead}
          activeFunctionIndex={0}
          data={{ functions: [{ name: 'read1', args: [''] }] } as unknown as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      expect(screen.getByTestId('smart-contract-function-tabs')).toBeTruthy();
    });

    it('does not display tabs if write type', () => {
      render(
        <SmartContractFunctionEditor
          type={ActionType.SmartContractWrite}
          activeFunctionIndex={0}
          data={{ functions: [{ name: 'write1', args: [''] }] } as unknown as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      expect(screen.queryByTestId('smart-contract-function-tabs')).toBeNull();
    });
  });

  it('renders function select and updates function', async () => {
    render(
      <SmartContractFunctionEditor
        type={ActionType.SmartContractWrite}
        activeFunctionIndex={0}
        data={{ functions: [{ name: 'write1', args: [''] }] } as unknown as SmartContractBaseData}
        onDataChange={mockHandleDataChange}
        onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
      />
    );
    expect(screen.getByTestId('smart-contract-function-select')).toBeTruthy();
    await userEvent.click(screen.getByText('write1'));
    await userEvent.click(screen.getByText('write2'));
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      functions: [
        {
          name: 'write2',
          args: [''],
          payableAmount: '',
        },
      ],
    });
  });

  it('renders function inputs and updates function', async () => {
    render(
      <SmartContractFunctionEditor
        type={ActionType.SmartContractWrite}
        activeFunctionIndex={0}
        data={{ functions: [{ name: 'write1', args: [''] }] } as unknown as SmartContractBaseData}
        onDataChange={mockHandleDataChange}
        onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
      />
    );
    expect(screen.getByTestId('smart-contract-function-inputs')).toBeTruthy();
    await userEvent.type(screen.getByRole('textbox'), 'a');
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      functions: [
        {
          name: 'write1',
          args: ['a'],
        },
      ],
    });
  });
});
