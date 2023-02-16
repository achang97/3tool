import { mockTool } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { Action, ActionType } from '@app/types';
import { ACTION_CONFIGS } from '@app/constants/actions';
import { useActiveTool } from '../../hooks/useActiveTool';
import { ActionList } from '../ActionList';

const mockUpdateTool = jest.fn();

const mockActions = [
  {
    type: ActionType.Javascript,
    name: 'action1',
  },
  {
    type: ActionType.SmartContractRead,
    name: 'action2',
  },
] as Action[];

jest.mock('../../hooks/useActiveTool');

describe('ActionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: { ...mockTool, actions: mockActions },
      updateTool: mockUpdateTool,
    }));
  });

  it('renders title', () => {
    const result = render(<ActionList />);
    expect(result.getByText('Action list')).toBeTruthy();
  });

  it('creates new action by clicking on "New" button and an action option', async () => {
    const mockType = ActionType.Javascript;
    const result = render(<ActionList />);

    await userEvent.click(result.getByText('New'));
    await userEvent.click(result.getByText(ACTION_CONFIGS[mockType].label));

    expect(mockUpdateTool).toHaveBeenCalledWith({
      actions: [
        ...mockActions,
        {
          type: mockType,
          name: 'action3',
          data: {
            [mockType]: {},
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

    const result = render(<ActionList />);
    expect(result.getByText('No created actions')).toBeTruthy();
  });

  it('renders list of actions', () => {
    const result = render(<ActionList />);

    expect(result.getByText(mockActions[0].name)).toBeTruthy();
    expect(result.getByText(mockActions[1].name)).toBeTruthy();
  });
});
