import { ActionType, EventHandlerType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useGetResourcesQuery } from '@app/redux/services/resources';
import { useActionMountExecute } from '../useActionMountExecute';
import { useActiveTool } from '../useActiveTool';

const mockExecuteAction = jest.fn();

jest.mock('../useActiveTool');

jest.mock('../useActionExecute', () => ({
  useActionExecute: jest.fn(() => mockExecuteAction),
}));

jest.mock('@app/redux/services/resources', () => ({
  useGetResourcesQuery: jest.fn(),
}));

describe('useActionMountExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not execute if resources have not loaded', () => {
    const mockActions = [
      { name: 'action1', type: ActionType.SmartContractRead, eventHandlers: [] },
    ];
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        actions: mockActions,
      },
    }));
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({}));
    const { result } = renderHook(() => useActionMountExecute());

    expect(mockExecuteAction).not.toHaveBeenCalled();
    expect(result.current.isLoading).toEqual(true);
  });

  it('executes read actions not in event handler chains on resource load', () => {
    const mockActions = [
      { name: 'action1', type: ActionType.Javascript, eventHandlers: [] },
      { name: 'action2', type: ActionType.SmartContractRead, eventHandlers: [] },
      { name: 'action3', type: ActionType.SmartContractWrite, eventHandlers: [] },
      {
        name: 'action4',
        type: ActionType.SmartContractRead,
        eventHandlers: [
          { type: EventHandlerType.Action, data: { action: { actionName: 'action5' } } },
        ],
      },
      {
        name: 'action5',
        type: ActionType.SmartContractRead,
        eventHandlers: [
          { type: EventHandlerType.Action, data: { action: { actionName: 'action6' } } },
        ],
      },
      { name: 'action6', type: ActionType.SmartContractRead, eventHandlers: [] },
    ];
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        actions: mockActions,
      },
    }));
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({ data: [] }));

    const { result } = renderHook(() => useActionMountExecute());

    // action2, action4
    expect(mockExecuteAction).toHaveBeenCalledTimes(2);
    expect(mockExecuteAction).toHaveBeenCalledWith(mockActions[1]);
    expect(mockExecuteAction).toHaveBeenCalledWith(mockActions[3]);
    expect(result.current.isLoading).toEqual(false);
  });

  it('does not execute again on action update', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        actions: [
          {
            name: 'Old Action',
            type: ActionType.SmartContractRead,
            eventHandlers: [],
          },
        ],
      },
    }));
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({ data: [] }));

    const { rerender } = renderHook(() => useActionMountExecute());
    expect(mockExecuteAction).toHaveBeenCalledTimes(1);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        actions: [
          {
            name: 'New Action',
            type: ActionType.SmartContractRead,
            eventHandlers: [],
          },
        ],
      },
    }));
    rerender();
    expect(mockExecuteAction).toHaveBeenCalledTimes(1);
  });
});
