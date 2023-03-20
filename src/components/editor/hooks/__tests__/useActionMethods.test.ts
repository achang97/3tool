import { ActionResult } from '@app/constants';
import { resetActionResult } from '@app/redux/features/activeToolSlice';
import { Action, ActionMethod } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActionMethods } from '../useActionMethods';

const mockActions = [{ name: 'action1' }, { name: 'action2' }] as Action[];
const mockDispatch = jest.fn();
const mockEnqueueAction = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../useActionQueue', () => ({
  useActionQueue: jest.fn(() => ({
    enqueueAction: mockEnqueueAction,
  })),
}));

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      actions: mockActions,
    },
  })),
}));

describe('useActionMethods', () => {
  it('returns function object map with action names as keys', () => {
    const { result } = renderHook(() => useActionMethods());
    expect(result.current).toEqual({
      action1: {
        reset: expect.any(Function),
        trigger: expect.any(Function),
      },
      action2: {
        reset: expect.any(Function),
        trigger: expect.any(Function),
      },
    });
  });

  it('reset: dispatches action to reset action result', () => {
    const { result } = renderHook(() => useActionMethods());
    result.current.action1[ActionMethod.Reset]();
    expect(mockDispatch).toHaveBeenCalledWith(resetActionResult('action1'));
  });

  it('trigger: enqueues action for execution', async () => {
    const mockActionResult: ActionResult = {
      data: 'something',
    };
    mockEnqueueAction.mockImplementation((_action, onExecute) =>
      onExecute(mockActionResult)
    );

    const { result } = renderHook(() => useActionMethods());
    const triggerResult = await result.current.action1[ActionMethod.Trigger]();

    expect(mockEnqueueAction).toHaveBeenCalledWith(
      mockActions[0],
      expect.any(Function)
    );
    expect(triggerResult).toEqual(mockActionResult.data);
  });
});
