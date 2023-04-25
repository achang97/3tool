import { ActionResult } from '@app/constants';
import { Action, ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useActionExecute } from '../useActionExecute';
import { useEvalArgs } from '../useEvalArgs';

const mockHandleActionResult = jest.fn();
const mockReadSmartContract = jest.fn();
const mockWriteSmartContract = jest.fn();
const mockTransformData = jest.fn();
const mockTrack = jest.fn();

const consoleLogSpy = jest.spyOn(console, 'log');
const dateNowSpy = jest.spyOn(Date, 'now');

const mockMode = 'view';

jest.mock('../useEvalArgs');

jest.mock('../useActionHandleResult', () => ({
  useActionHandleResult: jest.fn(() => mockHandleActionResult),
}));

jest.mock('../useActionSmartContractExecute', () => ({
  useActionSmartContractExecute: jest.fn(() => ({
    readSmartContract: mockReadSmartContract,
    writeSmartContract: mockWriteSmartContract,
  })),
}));

jest.mock('../useActionTransformer', () => ({
  useActionTransformer: jest.fn(() => mockTransformData),
}));

jest.mock('../useToolAnalyticsTrack', () => ({
  useToolAnalyticsTrack: jest.fn(() => mockTrack),
}));

jest.mock('../useToolMode', () => ({
  useToolMode: jest.fn(() => mockMode),
}));

describe('useActionExecute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useEvalArgs as jest.Mock).mockImplementation(() => ({
      staticEvalArgs: {},
    }));
    mockTransformData.mockImplementation((_transformableData, inputData) => inputData);
  });

  describe('execution', () => {
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
          javascript: { code: 'return button1.text' },
        },
      } as Action);
      expect(actionResult.data).toEqual('hello');
    });

    it('executes smart contract read action', async () => {
      mockReadSmartContract.mockImplementation(() => 'readResult');

      const { result } = renderHook(() => useActionExecute());

      const mockAction = {
        type: ActionType.SmartContractRead,
        data: {
          smartContractRead: {
            smartContractId: 'smartContractId',
          },
        },
      } as Action;
      const actionResult = await result.current(mockAction);

      expect(mockReadSmartContract).toHaveBeenCalledWith(mockAction.data.smartContractRead);
      expect(actionResult.data).toEqual(mockReadSmartContract());
    });

    it('executes smart contract write action', async () => {
      mockWriteSmartContract.mockImplementation(() => 'writeResult');

      const { result } = renderHook(() => useActionExecute());

      const mockAction = {
        name: 'action1',
        type: ActionType.SmartContractWrite,
        data: {
          smartContractWrite: {
            smartContractId: 'smartContractId',
          },
        },
      } as Action;
      const actionResult = await result.current(mockAction);

      expect(mockWriteSmartContract).toHaveBeenCalledWith(
        mockAction.name,
        mockAction.data.smartContractWrite
      );
      expect(actionResult.data).toEqual(mockWriteSmartContract());
    });
  });

  describe('transformer', () => {
    beforeEach(() => {
      mockTransformData.mockImplementation(() => 'transformedData');
    });

    it('transforms data from first execution step', async () => {
      const { result } = renderHook(() => useActionExecute());

      const mockAction = {
        type: ActionType.Javascript,
        data: {
          javascript: {
            code: 'return "world"',
            transformer: 'return data;',
            transformerEnabled: true,
          },
        },
      } as Action;
      const actionResult = await result.current(mockAction);

      expect(mockTransformData).toHaveBeenCalledWith(mockAction.data.javascript, 'world');
      expect(actionResult.data).toEqual(mockTransformData());
    });

    it('does not transform data from first execution step if data is undefined', async () => {
      const { result } = renderHook(() => useActionExecute());

      await result.current({
        type: ActionType.Javascript,
        data: {},
      } as Action);
      expect(mockTransformData).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('returns error message', async () => {
      const { result } = renderHook(() => useActionExecute());

      const actionResult = await result.current({
        type: ActionType.Javascript,
        data: { javascript: { code: 'asdf', transformer: '' } },
      } as Action);
      expect(actionResult.data).toBeUndefined();
      expect(actionResult.error).toEqual('asdf is not defined');
    });

    it('logs error message', async () => {
      const { result } = renderHook(() => useActionExecute());

      await result.current({
        name: 'action1',
        type: ActionType.Javascript,
        data: { javascript: { code: 'asdf', transformer: '' } },
      } as Action);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Error] action1:',
        new Error('asdf is not defined')
      );
    });
  });

  describe('success', () => {
    it('logs success message', async () => {
      const { result } = renderHook(() => useActionExecute());

      await result.current({
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: { code: 'return 1' },
        },
      } as Action);
      expect(consoleLogSpy).toHaveBeenCalledWith('[Success] action1:', 1);
    });
  });

  describe('runtime', () => {
    it('returns runtime in milliseconds', async () => {
      const { result } = renderHook(() => useActionExecute());

      dateNowSpy.mockImplementationOnce(() => 0);
      dateNowSpy.mockImplementationOnce(() => 100);

      const actionResult = await result.current({
        type: ActionType.Javascript,
        data: {
          javascript: { code: 'return 1' },
        },
      } as Action);
      expect(actionResult.runtime).toEqual(100);
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
        runtime: expect.any(Number),
      };
      expect(mockHandleActionResult).toHaveBeenCalledWith(mockAction, mockResult);
    });
  });

  describe('analytics', () => {
    it('tracks start event', async () => {
      const { result } = renderHook(() => useActionExecute());

      const mockAction = {
        name: 'action1',
        type: ActionType.Javascript,
        data: {
          javascript: { code: 'return 1' },
        },
      } as Action;
      await result.current(mockAction);
      expect(mockTrack).toHaveBeenCalledWith('Action Start', {
        mode: mockMode,
        actionType: mockAction.type,
        actionId: mockAction._id,
        actionName: mockAction.name,
      });
    });

    it.each`
      code          | resultType
      ${'asdf'}     | ${'failure'}
      ${'return 1'} | ${'success'}
    `(
      'tracks complete $result event',
      async ({ code, resultType }: { code: string; resultType: string }) => {
        const { result } = renderHook(() => useActionExecute());

        const mockAction = {
          name: 'action1',
          type: ActionType.Javascript,
          data: {
            javascript: { code },
          },
        } as Action;
        const actionResult = await result.current(mockAction);
        expect(mockTrack).toHaveBeenCalledWith('Action Complete', {
          mode: mockMode,
          actionType: mockAction.type,
          actionId: mockAction._id,
          actionName: mockAction.name,
          runtime: actionResult.runtime,
          result: resultType,
        });
      }
    );
  });
});
