import { useActionConfirmDiscard } from '@app/components/editor/hooks/useActionConfirmDiscard';
import { ACTION_CONFIGS, ACTION_DATA_TEMPLATES } from '@app/constants/actions';
import { focusAction } from '@app/redux/features/editorSlice';
import { Action, ActionType } from '@app/types';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { CreateActionButton } from '../CreateActionButton';

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

jest.mock('../../../hooks/useActionConfirmDiscard');

jest.mock('../../../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      actions: mockActions,
    },
    updateTool: mockUpdateTool,
  })),
}));

describe('CreateActionButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActionConfirmDiscard as jest.Mock).mockImplementation(() => () => true);
  });

  it('renders "New" text', () => {
    const result = render(<CreateActionButton />);
    expect(result.getByText('New')).toBeTruthy();
  });

  it.each([ActionType.Javascript, ActionType.SmartContractRead])(
    'opens menu with available action types',
    async (actionType: ActionType) => {
      const result = render(<CreateActionButton />);
      await userEvent.click(result.getByText('New'));

      expect(result.getByText(ACTION_CONFIGS[actionType].label)).toBeTruthy();
    }
  );

  it('does not create new action if user cancels in alert', async () => {
    (useActionConfirmDiscard as jest.Mock).mockImplementation(
      () => () => false
    );

    const result = render(<CreateActionButton />);
    await userEvent.click(result.getByText('New'));

    await userEvent.click(result.getByText(ACTION_CONFIGS.javascript.label));
    expect(mockUpdateTool).not.toHaveBeenCalled();
  });

  it.each([ActionType.Javascript, ActionType.SmartContractRead])(
    'creates new action with automatically generated name on menu option click',
    async (actionType: ActionType) => {
      const result = render(<CreateActionButton />);
      await userEvent.click(result.getByText('New'));

      await userEvent.click(result.getByText(ACTION_CONFIGS[actionType].label));

      const newAction: Action = {
        type: actionType,
        name: 'action2',
        data: {
          [actionType]: ACTION_DATA_TEMPLATES[actionType],
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
    const result = render(<CreateActionButton />);

    await userEvent.click(result.getByText('New'));
    await userEvent.click(
      result.getByText(ACTION_CONFIGS[ActionType.Javascript].label)
    );

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('focuses action on successful creation', async () => {
    mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
    const result = render(<CreateActionButton />);

    await userEvent.click(result.getByText('New'));
    await userEvent.click(
      result.getByText(ACTION_CONFIGS[ActionType.Javascript].label)
    );

    const newAction: Action = {
      type: ActionType.Javascript,
      name: 'action2',
      data: {
        javascript: ACTION_DATA_TEMPLATES.javascript,
      },
      eventHandlers: [],
    };
    expect(mockDispatch).toHaveBeenCalledWith(focusAction(newAction));
  });
});
