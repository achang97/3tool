import { ActionType } from '@app/types';
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
    const mockActions = [{ type: ActionType.SmartContractRead }];
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

  it('executes all read actions on resource load', () => {
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
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({ data: [] }));

    const { result } = renderHook(() => useActionMountExecute());

    expect(mockExecuteAction).toHaveBeenCalledTimes(1);
    expect(mockExecuteAction).toHaveBeenCalledWith(mockActions[1]);
    expect(result.current.isLoading).toEqual(false);
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
    (useGetResourcesQuery as jest.Mock).mockImplementation(() => ({ data: [] }));

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
