import { useActionConfirmDiscard } from '@app/components/editor/hooks/useActionConfirmDiscard';
import { ACTION_CONFIGS, ACTION_DATA_TEMPLATES } from '@app/constants';
import { focusAction } from '@app/redux/features/editorSlice';
import { Action, ActionType } from '@app/types';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    render(<CreateActionButton />);
    expect(screen.getByText('New')).toBeTruthy();
  });

  it.each([ActionType.Javascript, ActionType.SmartContractRead])(
    'opens menu with %s type',
    async (actionType: ActionType) => {
      render(<CreateActionButton />);
      await userEvent.click(screen.getByText('New'));

      expect(screen.getByText(ACTION_CONFIGS[actionType].label)).toBeTruthy();
    }
  );

  it('does not create new action if user cancels in alert', async () => {
    (useActionConfirmDiscard as jest.Mock).mockImplementation(() => () => false);

    render(<CreateActionButton />);
    await userEvent.click(screen.getByText('New'));

    await userEvent.click(screen.getByText(ACTION_CONFIGS.javascript.label));
    expect(mockUpdateTool).not.toHaveBeenCalled();
  });

  // Normal action types
  it.each([ActionType.Javascript])('creates new %s action', async (actionType: ActionType) => {
    render(<CreateActionButton />);
    await userEvent.click(screen.getByText('New'));

    await userEvent.click(screen.getByText(ACTION_CONFIGS[actionType].label));

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
  });

  it('creates new SmartContractRead action with SmartContractRead and SmartContractWrite data', async () => {
    render(<CreateActionButton />);
    await userEvent.click(screen.getByText('New'));

    await userEvent.click(screen.getByText(ACTION_CONFIGS[ActionType.SmartContractRead].label));

    const newAction: Action = {
      type: ActionType.SmartContractRead,
      name: 'action2',
      data: {
        [ActionType.SmartContractRead]: ACTION_DATA_TEMPLATES[ActionType.SmartContractRead],
        [ActionType.SmartContractWrite]: ACTION_DATA_TEMPLATES[ActionType.SmartContractWrite],
      },
      eventHandlers: [],
    };
    expect(mockUpdateTool).toHaveBeenCalledWith({
      actions: [...mockActions, newAction],
    });
  });

  it('does not focus action on failed creation', async () => {
    mockUpdateTool.mockImplementation(() => undefined);
    render(<CreateActionButton />);

    await userEvent.click(screen.getByText('New'));
    await userEvent.click(screen.getByText(ACTION_CONFIGS[ActionType.Javascript].label));

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('focuses action on successful creation', async () => {
    mockUpdateTool.mockImplementation(() => ({}));
    render(<CreateActionButton />);

    await userEvent.click(screen.getByText('New'));
    await userEvent.click(screen.getByText(ACTION_CONFIGS[ActionType.Javascript].label));

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
