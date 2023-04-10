import { ActionResult } from '@app/constants';
import { Action, ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActionExecute } from '../useActionExecute';
import { useEvalArgs } from '../useEvalArgs';

const mockHandleActionResult = jest.fn();

jest.mock('../useEvalArgs');
jest.mock('../useActionHandleResult', () => ({
  useActionHandleResult: jest.fn(() => mockHandleActionResult),
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
      it('calls action handler function on execution', async () => {
        const { result } = renderHook(() => useActionExecute());

        const mockAction = {
          type: ActionType.Javascript,
          data: { javascript: { code: 'asdf', transformer: '' } },
        } as Action;
        await result.current(mockAction);

        const mockResult: ActionResult = {
          data: undefined,
          error: 'asdf is not defined',
        };
        expect(mockHandleActionResult).toHaveBeenCalledWith(mockAction, mockResult);
      });
    });
  });
});
