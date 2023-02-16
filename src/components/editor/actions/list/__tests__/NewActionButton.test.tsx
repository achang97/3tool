import { ACTION_CONFIGS } from '@app/constants/actions';
import { focusAction } from '@app/redux/features/editorSlice';
import { Action, ActionType } from '@app/types';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { NewActionButton } from '../NewActionButton';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

const mockActions = [
  {
    type: ActionType.Javascript,
    name: 'action1',
  },
] as Action[];

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../../../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      actions: mockActions,
    },
    updateTool: mockUpdateTool,
  })),
}));

describe('NewActionButton', () => {
  it('renders "New" text', () => {
    const result = render(<NewActionButton />);
    expect(result.getByText('New')).toBeTruthy();
  });

  it.each([ActionType.Javascript, ActionType.SmartContractRead])(
    'opens menu with available action types',
    async (actionType: ActionType) => {
      const result = render(<NewActionButton />);
      await userEvent.click(result.getByText('New'));

      expect(result.getByText(ACTION_CONFIGS[actionType].label)).toBeTruthy();
    }
  );

  it.each([ActionType.Javascript, ActionType.SmartContractRead])(
    'creates new action with automatically generated name on menu option click',
    async (actionType: ActionType) => {
      const result = render(<NewActionButton />);
      await userEvent.click(result.getByText('New'));

      await userEvent.click(result.getByText(ACTION_CONFIGS[actionType].label));

      const newAction: Action = {
        type: actionType,
        name: 'action2',
        data: {
          [actionType]: {},
        },
        eventHandlers: [],
      };
      expect(mockUpdateTool).toHaveBeenCalledWith({
        actions: [...mockActions, newAction],
      });
    }
  );

  it('does not focus action on failed creation', async () => {
    mockUpdateTool.mockImplementation(() => mockApiErrorResponse);
    const result = render(<NewActionButton />);

    await userEvent.click(result.getByText('New'));
    await userEvent.click(
      result.getByText(ACTION_CONFIGS[ActionType.Javascript].label)
    );

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('focuses action on successful creation', async () => {
    mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
    const result = render(<NewActionButton />);

    await userEvent.click(result.getByText('New'));
    await userEvent.click(
      result.getByText(ACTION_CONFIGS[ActionType.Javascript].label)
    );

    expect(mockDispatch).toHaveBeenCalledWith(focusAction('action2'));
  });
});
