import { ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActionMountExecute } from '../useActionMountExecute';
import { useActiveTool } from '../useActiveTool';

const mockExecuteAction = jest.fn();

jest.mock('../useActiveTool');

jest.mock('../useActionExecute', () => ({
  useActionExecute: jest.fn(() => mockExecuteAction),
}));

describe('useActionMountExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('executes all read actions on mount', () => {
    const mockActions = [
      { type: ActionType.Javascript },
      { type: ActionType.SmartContractRead },
      { type: ActionType.SmartContractWrite },
    ];
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        actions: mockActions,
      },
    }));
    renderHook(() => useActionMountExecute());

    expect(mockExecuteAction).toHaveBeenCalledTimes(1);
    expect(mockExecuteAction).toHaveBeenCalledWith(mockActions[1]);
  });

  it('does not execute again on action update', () => {
    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        actions: [
          {
            type: ActionType.SmartContractRead,
            name: 'Old Action',
          },
        ],
      },
    }));
    const { rerender } = renderHook(() => useActionMountExecute());
    expect(mockExecuteAction).toHaveBeenCalledTimes(1);

    (useActiveTool as jest.Mock).mockImplementation(() => ({
      tool: {
        actions: [
          {
            type: ActionType.SmartContractRead,
            name: 'New Action',
          },
        ],
      },
    }));
    rerender();
    expect(mockExecuteAction).toHaveBeenCalledTimes(1);
  });
});
