import { ActionResult } from '@app/constants';
import { setActionResult } from '@app/redux/features/activeToolSlice';
import { Action, ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { executeAction } from '../../utils/actions';
import { useActionExecute } from '../useActionExecute';

const mockAction = {
  name: 'action1',
  type: ActionType.Javascript,
  data: { javascript: { code: '1', transformer: '' } },
} as Action;

const mockEvalArgs = {
  button1: {
    text: 'hello',
  },
};

const mockEnqueueSnackbar = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../useEvalArgs', () => ({
  useEvalArgs: jest.fn(() => mockEvalArgs),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('../../utils/actions');

describe('useActionExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (executeAction as jest.Mock).mockImplementation(() => ({}));
  });

  it('executes action with action and eval args', () => {
    const { result } = renderHook(() => useActionExecute());

    result.current(mockAction);
    expect(executeAction).toHaveBeenCalledWith(mockAction, mockEvalArgs);
  });

  it('dispatches action to set the action result', () => {
    const mockResult: ActionResult = {
      data: 'data',
      error: 'error',
    };
    (executeAction as jest.Mock).mockImplementation(() => mockResult);

    const { result } = renderHook(() => useActionExecute());

    result.current(mockAction);
    expect(mockDispatch).toHaveBeenCalledWith(
      setActionResult({ name: mockAction.name, result: mockResult })
    );
  });

  it('enqueues error snackbar on error', () => {
    (executeAction as jest.Mock).mockImplementation(() => ({
      error: 'error',
    }));

    const { result } = renderHook(() => useActionExecute());

    result.current(mockAction);
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      `Failed to execute ${mockAction.name}`,
      { variant: 'error' }
    );
  });

  it('enqueues success snackbar on success', () => {
    (executeAction as jest.Mock).mockImplementation(() => ({
      data: 'data',
    }));

    const { result } = renderHook(() => useActionExecute());

    result.current(mockAction);
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      `Executed ${mockAction.name}`,
      { variant: 'success' }
    );
  });
});
