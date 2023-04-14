import { render } from '@tests/utils/renderWithContext';
import { screen } from '@testing-library/react';
import { ActionType, ResourceType, SmartContractBaseData } from '@app/types';
import { useAppSelector } from '@app/redux/hooks';
import userEvent from '@testing-library/user-event';
import { updateFocusedAction, updateFocusedActionState } from '@app/redux/features/editorSlice';
import { SmartContractEditor } from '../SmartContractEditor';

const mockDispatch = jest.fn();
const mockHandleDataChange = jest.fn();
const mockExtendSmartContractUpdate = jest.fn();

jest.mock('@app/components/editor/hooks/useActionSmartContractUpdate', () => ({
  useActionSmartContractUpdate: jest.fn(() => mockExtendSmartContractUpdate),
}));

jest.mock('@app/components/resources/hooks/useAbiResources', () => ({
  useAbiResources: jest.fn(() => []),
}));

jest.mock('@app/components/resources/hooks/useSmartContractResources', () => ({
  useSmartContractResources: jest.fn(() => [
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
  ]),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('SmartContractEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedActionState: { smartContractFunctionIndex: 0 },
    }));
  });

  it('renders loop section', () => {
    render(
      <SmartContractEditor
        type={ActionType.SmartContractRead}
        data={{} as SmartContractBaseData}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByTestId('loop-section')).toBeTruthy();
  });

  describe('resources', () => {
    it('renders resource section', () => {
      render(
        <SmartContractEditor
          type={ActionType.SmartContractRead}
          data={{} as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
        />
      );
      expect(screen.getByText('Resource')).toBeTruthy();
      expect(screen.getByTestId('smart-contract-resource-editor')).toBeTruthy();
    });

    it('does not update focused action if extended update is undefined', async () => {
      mockExtendSmartContractUpdate.mockImplementation(() => ({
        update: undefined,
        hasResetFunctions: false,
      }));
      render(
        <SmartContractEditor
          type={ActionType.SmartContractRead}
          data={{ smartContractId: '' } as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getByLabelText(/Smart contract/));
      await userEvent.click(screen.getByText(/Smart Contract 1/));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('updates function index if functions have been reset', async () => {
      mockExtendSmartContractUpdate.mockImplementation((update) => ({
        update,
        hasResetFunctions: true,
      }));
      render(
        <SmartContractEditor
          type={ActionType.SmartContractRead}
          data={{ smartContractId: '' } as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getByLabelText(/Smart contract/));
      await userEvent.click(screen.getByText(/Smart Contract 1/));
      expect(mockDispatch).toHaveBeenCalledWith(
        updateFocusedActionState({ smartContractFunctionIndex: 0 })
      );
    });

    it('does not update function index if functions have not been reset', async () => {
      mockExtendSmartContractUpdate.mockImplementation((update) => ({
        update,
        hasResetFunctions: false,
      }));
      render(
        <SmartContractEditor
          type={ActionType.SmartContractRead}
          data={{ smartContractId: '' } as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getByLabelText(/Smart contract/));
      await userEvent.click(screen.getByText(/Smart Contract 1/));
      expect(mockDispatch).not.toHaveBeenCalledWith(
        updateFocusedActionState({ smartContractFunctionIndex: 0 })
      );
    });

    it('updates both read and write data objects', async () => {
      mockExtendSmartContractUpdate.mockImplementation((update) => ({
        update,
        hasResetFunctions: false,
      }));
      render(
        <SmartContractEditor
          type={ActionType.SmartContractRead}
          data={{ smartContractId: '' } as SmartContractBaseData}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(screen.getByLabelText(/Smart contract/));
      await userEvent.click(screen.getByText(/Smart Contract 1/));
      expect(mockDispatch).toHaveBeenCalledWith(
        updateFocusedAction({
          data: {
            smartContractRead: { smartContractId: '1' },
            smartContractWrite: { smartContractId: '1' },
          },
        })
      );
    });
  });

  it('renders function section', () => {
    render(
      <SmartContractEditor
        type={ActionType.SmartContractRead}
        data={{} as SmartContractBaseData}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByText('Function')).toBeTruthy();
    expect(screen.getByTestId('smart-contract-function-editor')).toBeTruthy();
  });

  it('renders transformer section', () => {
    render(
      <SmartContractEditor
        type={ActionType.SmartContractRead}
        data={{} as SmartContractBaseData}
        onDataChange={mockHandleDataChange}
      />
    );
    expect(screen.getByTestId('transformer-section')).toBeTruthy();
  });
});
