import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE } from '@app/constants';
import { SmartContractBaseDataFunction } from '@app/types';
import { SmartContractFunctionTabs } from '../SmartContractFunctionTabs';

const mockHandleDataChange = jest.fn();
const mockHandleActiveFunctionIndexChange = jest.fn();

describe('SmartContractFunctionTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render tabs if there is only 1 function', () => {
    render(
      <SmartContractFunctionTabs
        functions={[{ name: 'function1' }] as unknown as SmartContractBaseDataFunction[]}
        activeFunctionIndex={0}
        onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.queryByText('function1')).toBeNull();
  });

  it('renders tabs if there are >= 2 functions', () => {
    render(
      <SmartContractFunctionTabs
        functions={
          [
            { name: 'function1' },
            { name: 'function2' },
          ] as unknown as SmartContractBaseDataFunction[]
        }
        activeFunctionIndex={0}
        onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByText('function1')).toBeTruthy();
    expect(screen.getByText('function2')).toBeTruthy();
  });

  it('renders tab at active index as selected', () => {
    render(
      <SmartContractFunctionTabs
        functions={
          [
            { name: 'function1' },
            { name: 'function2' },
          ] as unknown as SmartContractBaseDataFunction[]
        }
        activeFunctionIndex={0}
        onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByText('function1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('function2')).toHaveAttribute('aria-selected', 'false');
  });

  it('sets active function index on tab click', async () => {
    render(
      <SmartContractFunctionTabs
        functions={
          [
            { name: 'function1' },
            { name: 'function2' },
          ] as unknown as SmartContractBaseDataFunction[]
        }
        activeFunctionIndex={0}
        onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        onDataChange={mockHandleDataChange}
      />
    );
    await userEvent.click(screen.getByText('function2'));
    expect(mockHandleActiveFunctionIndexChange).toHaveBeenCalledWith(1);
  });

  it('adds function on "Add function" button click', async () => {
    render(
      <SmartContractFunctionTabs
        functions={[]}
        activeFunctionIndex={0}
        onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
        onDataChange={mockHandleDataChange}
      />
    );
    await userEvent.click(screen.getByText('Add function'));
    expect(mockHandleDataChange).toHaveBeenCalledWith({
      functions: [SMART_CONTRACT_BASE_DATA_FUNCTION_TEMPLATE],
    });
    expect(mockHandleActiveFunctionIndexChange).toHaveBeenCalledWith(0);
  });

  describe('deletion', () => {
    it('deletes function on close icon click', async () => {
      render(
        <SmartContractFunctionTabs
          functions={
            [
              { name: 'function1' },
              { name: 'function2' },
            ] as unknown as SmartContractBaseDataFunction[]
          }
          activeFunctionIndex={0}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getAllByTestId('smart-contract-function-tabs-delete')[0]);
      expect(mockHandleDataChange).toHaveBeenCalledWith({
        functions: [{ name: 'function2' }],
      });
    });

    it('sets active index to 0 if active function is deleted', async () => {
      render(
        <SmartContractFunctionTabs
          functions={
            [
              { name: 'function1' },
              { name: 'function2' },
            ] as unknown as SmartContractBaseDataFunction[]
          }
          activeFunctionIndex={0}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getAllByTestId('smart-contract-function-tabs-delete')[0]);
      expect(mockHandleActiveFunctionIndexChange).toHaveBeenCalledWith(0);
    });

    it('decreases active index by 1 if a prior function is deleted', async () => {
      render(
        <SmartContractFunctionTabs
          functions={
            [
              { name: 'function1' },
              { name: 'function2' },
              { name: 'function3' },
            ] as unknown as SmartContractBaseDataFunction[]
          }
          activeFunctionIndex={2}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getAllByTestId('smart-contract-function-tabs-delete')[0]);
      expect(mockHandleActiveFunctionIndexChange).toHaveBeenCalledWith(1);
    });

    it('keeps current index if following function is deleted', async () => {
      render(
        <SmartContractFunctionTabs
          functions={
            [
              { name: 'function1' },
              { name: 'function2' },
              { name: 'function3' },
            ] as unknown as SmartContractBaseDataFunction[]
          }
          activeFunctionIndex={0}
          onActiveFunctionIndexChange={mockHandleActiveFunctionIndexChange}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getAllByTestId('smart-contract-function-tabs-delete')[2]);
      expect(mockHandleActiveFunctionIndexChange).not.toHaveBeenCalled();
    });
  });
});
