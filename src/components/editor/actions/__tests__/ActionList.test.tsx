import { mockTool } from '@tests/constants/data';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { Action, ActionType } from '@app/types';
import { ACTION_CONFIGS, ACTION_DATA_TEMPLATES } from '@app/constants';
import { useActiveTool } from '../../hooks/useActiveTool';
import { ActionList } from '../ActionList';

const mockUpdateTool = jest.fn();

const mockActions = [
  {
    type: ActionType.Javascript,
    name: 'action1',
    eventHandlers: [],
  },
  {
    type: ActionType.SmartContractRead,
    name: 'action2',
    eventHandlers: [],
  },
] as unknown as Action[];

jest.mock('../../hooks/useActiveTool');
jest.mock('../../hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('ActionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        ...mockTool,
        actions: mockActions,
        components: [],
      },
      updateTool: mockUpdateTool,
    }));
  });

  it('renders title', () => {
    render(<ActionList />);
    expect(screen.getByText('Action list')).toBeTruthy();
  });

  it('creates new action by clicking on "New" button and an action option', async () => {
    const mockType = ActionType.Javascript;
    render(<ActionList />);

    await userEvent.click(screen.getByText('New'));
    await userEvent.click(screen.getByText(ACTION_CONFIGS[mockType].label));

    expect(mockUpdateTool).toHaveBeenCalledWith({
      actions: [
        ...mockActions,
        {
          type: mockType,
          name: 'action3',
          data: {
            [mockType]: ACTION_DATA_TEMPLATES[mockType],
          },
          eventHandlers: [],
        },
      ],
    });
  });

  it('renders "No created actions" placeholder if there are no actions', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: { actions: [] },
    }));

    render(<ActionList />);
    expect(screen.getByText('No created actions')).toBeTruthy();
  });

  it('renders list of actions', () => {
    render(<ActionList />);

    expect(screen.getByText(mockActions[0].name)).toBeTruthy();
    expect(screen.getByText(mockActions[1].name)).toBeTruthy();
  });
});
