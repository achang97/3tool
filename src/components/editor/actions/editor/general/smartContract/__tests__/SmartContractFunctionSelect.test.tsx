import { ActionType } from '@app/types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateFocusedAction } from '@app/redux/features/editorSlice';
import { render } from '@tests/utils/renderWithContext';
import { SmartContractAbiFunction } from '@app/utils/abi';
import { SmartContractFunctionSelect } from '../SmartContractFunctionSelect';

const mockHandleActiveFunctionChange = jest.fn();
const mockHandleActiveFunctionIndexChange = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('SmartContractFunctionSelect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('type', () => {
    it('renders read and write options', () => {
      render(
        <SmartContractFunctionSelect
          type={ActionType.SmartContractRead}
          abiFunctions={[]}
          activeFunction={{ name: '', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      expect(screen.getByText('Read')).toBeTruthy();
      expect(screen.getByText('Write')).toBeTruthy();
    });

    it('renders type as selected option', () => {
      render(
        <SmartContractFunctionSelect
          type={ActionType.SmartContractRead}
          abiFunctions={[]}
          activeFunction={{ name: '', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      expect(screen.getByText('Read')).toHaveAttribute('aria-pressed', 'true');
    });

    it('updates type and active function index on option click', async () => {
      render(
        <SmartContractFunctionSelect
          type={ActionType.SmartContractRead}
          abiFunctions={[]}
          activeFunction={{ name: '', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      await userEvent.click(screen.getByText('Write'));
      expect(mockDispatch).toHaveBeenCalledWith(
        updateFocusedAction({ type: ActionType.SmartContractWrite })
      );
      expect(mockHandleActiveFunctionIndexChange).toHaveBeenCalledWith(0);
    });
  });

  describe('function', () => {
    it('renders active function as selected value', () => {
      render(
        <SmartContractFunctionSelect
          type={ActionType.SmartContractRead}
          abiFunctions={[{ name: 'function1' }] as SmartContractAbiFunction[]}
          activeFunction={{ name: 'function1', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      expect(
        screen.getByTestId('smart-contract-function-select-function-select')
      ).toHaveDisplayValue('function1');
    });

    it('updates active function on change', async () => {
      render(
        <SmartContractFunctionSelect
          type={ActionType.SmartContractRead}
          abiFunctions={
            [
              { name: 'function1', inputs: [] },
              { name: 'function2', inputs: [{}] },
            ] as SmartContractAbiFunction[]
          }
          activeFunction={{ name: 'function1', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      await userEvent.click(screen.getByText('function1'));
      await userEvent.click(screen.getByText('function2'));
      expect(mockHandleActiveFunctionChange).toHaveBeenCalledWith({
        name: 'function2',
        args: [''],
        payableAmount: '',
      });
    });

    it('renders select as disabled if there are no abi functions', () => {
      render(
        <SmartContractFunctionSelect
          type={ActionType.SmartContractRead}
          abiFunctions={[]}
          activeFunction={{ name: '', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      expect(screen.getByTestId('smart-contract-function-select-function-select')).toBeDisabled();
    });

    it('renders "Select function" placeholder', () => {
      render(
        <SmartContractFunctionSelect
          type={ActionType.SmartContractRead}
          abiFunctions={[]}
          activeFunction={{ name: '', args: [], payableAmount: '' }}
          onActiveFunctionChange={mockHandleActiveFunctionChange}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        />
      );
      expect(screen.getByText('Select function')).toBeTruthy();
    });
  });
});
