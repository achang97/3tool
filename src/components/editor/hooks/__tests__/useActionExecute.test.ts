import { setActionResult } from '@app/redux/features/activeToolSlice';
import { Action, ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActionExecute } from '../useActionExecute';
import { useEvalArgs } from '../useEvalArgs';

const mockEnqueueSnackbar = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../useEvalArgs');

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('../useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

describe('useActionExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useEvalArgs as jest.Mock).mockImplementation(() => ({
      staticEvalArgs: {},
    }));
  });

  describe('execution', () => {
    describe('javascript', () => {
      it('executes javascript action with static eval args', async () => {
        (useEvalArgs as jest.Mock).mockImplementation(() => ({
          staticEvalArgs: {
            button1: {
              text: 'hello',
            },
          },
        }));
        const { result } = renderHook(() => useActionExecute());

        const actionResult = await result.current({
          type: ActionType.Javascript,
          data: {
            javascript: { code: 'return button1.text', transformer: '' },
          },
        } as Action);
        expect(actionResult.data).toEqual('hello');
      });
    });

    describe('transformer', () => {
      it('transforms data from first execution step with static eval args', async () => {
        (useEvalArgs as jest.Mock).mockImplementation(() => ({
          staticEvalArgs: {
            button1: {
              text: 'hello',
            },
          },
        }));
        const { result } = renderHook(() => useActionExecute());

        const actionResult = await result.current({
          type: ActionType.Javascript,
          data: {
            javascript: {
              code: 'return "world"',
              // eslint-disable-next-line no-template-curly-in-string
              transformer: 'return `${button1.text} ${data}!`',
            },
          },
        } as Action);
        expect(actionResult.data).toEqual('hello world!');
      });
    });

    describe('error', () => {
      it('returns error message', async () => {
        const { result } = renderHook(() => useActionExecute());

        const actionResult = await result.current({
          type: ActionType.Javascript,
          data: { javascript: { code: 'asdf', transformer: '' } },
        } as Action);
        expect(actionResult).toEqual({
          data: undefined,
          error: 'asdf is not defined',
        });
      });
    });

    describe('response handling', () => {
      it('dispatches action to set the action result', async () => {
        const { result } = renderHook(() => useActionExecute());

        const actionResult = await result.current({
          name: 'action1',
          type: ActionType.Javascript,
          data: {
            javascript: { code: 'return 1', transformer: '' },
          },
        } as Action);

        expect(mockDispatch).toHaveBeenCalledWith(
          setActionResult({ name: 'action1', result: actionResult })
        );
      });

      it('enqueues error snackbar on error', async () => {
        const { result } = renderHook(() => useActionExecute());

        await result.current({
          name: 'action1',
          type: ActionType.Javascript,
          data: {
            javascript: { code: 'asdf', transformer: '' },
          },
        } as Action);

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          'Failed to execute action1',
          { variant: 'error' }
        );
      });

      it('enqueues success snackbar on success', async () => {
        const { result } = renderHook(() => useActionExecute());

        await result.current({
          name: 'action1',
          type: ActionType.Javascript,
          data: {
            javascript: { code: 'return 1', transformer: '' },
          },
        } as Action);

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Executed action1', {
          variant: 'success',
        });
      });
    });
  });
});
