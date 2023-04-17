import { ActionResult } from '@app/constants';
import { setActionResult } from '@app/redux/features/activeToolSlice';
import { Action, ActionEvent } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActionHandleResult } from '../useActionHandleResult';

const mockEnqueueSnackbar = jest.fn();
const mockDispatch = jest.fn();
const mockExecuteEventHandler = jest.fn();

const mockAction = {
  name: 'action1',
  eventHandlers: [
    {
      event: ActionEvent.Success,
    },
    {
      event: ActionEvent.Error,
    },
  ],
} as Action;

const mockErrorResult: ActionResult = {
  data: undefined,
  error: 'Error',
};
const mockSuccessResult: ActionResult = {
  data: 1,
};

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('../useEventHandlerExecute', () => ({
  useEventHandlerExecute: jest.fn(() => mockExecuteEventHandler),
}));

describe('useActionHandleResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches action to set the action result', () => {
    const { result } = renderHook(() => useActionHandleResult());

    result.current(mockAction, mockSuccessResult);
    expect(mockDispatch).toHaveBeenCalledWith(
      setActionResult({ name: mockAction.name, result: mockSuccessResult })
    );
  });

  describe('success', () => {
    it('enqueues success snackbar on success', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockSuccessResult);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(`Executed ${mockAction.name}`, {
        variant: 'success',
      });
    });

    it('executes success event handlers', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockSuccessResult);
      expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockAction.eventHandlers[0]);
      expect(mockExecuteEventHandler).not.toHaveBeenCalledWith(mockAction.eventHandlers[1]);
    });
  });

  describe('error', () => {
    it('enqueues error snackbar on error', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockErrorResult);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(`Failed to execute ${mockAction.name}`, {
        variant: 'error',
      });
    });

    it('executes error event handlers', () => {
      const { result } = renderHook(() => useActionHandleResult());

      result.current(mockAction, mockErrorResult);
      expect(mockExecuteEventHandler).not.toHaveBeenCalledWith(mockAction.eventHandlers[0]);
      expect(mockExecuteEventHandler).toHaveBeenCalledWith(mockAction.eventHandlers[1]);
    });
  });
});
