import { useAppSelector } from '@app/redux/hooks';
import { ActionType } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockApiErrorResponse, mockApiSuccessResponse } from '@tests/constants/api';
import { useActionSaveHandlers } from '../useActionSaveHandlers';

const mockExecuteAction = jest.fn();
const mockUpdateTool = jest.fn();
const mockFocusedAction = {
  name: 'action1',
  type: ActionType.Javascript,
  data: {
    javascript: {
      code: 'new code',
    },
  },
};

jest.mock('@app/redux/hooks');

jest.mock('../useActionExecute', () => ({
  useActionExecute: jest.fn(() => mockExecuteAction),
}));

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      actions: [
        {
          name: 'action1',
          type: ActionType.Javascript,
          data: {
            javascript: {
              code: 'old code',
            },
          },
        },
      ],
    },
    updateTool: mockUpdateTool,
  })),
}));

describe('useActionSaveHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      focusedAction: mockFocusedAction,
    }));
  });

  describe('executeAction', () => {
    it('does not execute action if there is no focused action', () => {
      (useAppSelector as jest.Mock).mockImplementation(() => ({
        focusedAction: undefined,
      }));
      const { result } = renderHook(() => useActionSaveHandlers());
      result.current.executeAction();
      expect(mockExecuteAction).not.toHaveBeenCalled();
    });

    it('executes action if there is a focused action', () => {
      const { result } = renderHook(() => useActionSaveHandlers());
      result.current.executeAction();
      expect(mockExecuteAction).toHaveBeenCalledWith(mockFocusedAction);
    });
  });

  describe('saveAction', () => {
    it('updates tool action list', async () => {
      const { result } = renderHook(() => useActionSaveHandlers());
      await result.current.saveAction();
      expect(mockUpdateTool).toHaveBeenCalledWith({
        actions: [mockFocusedAction],
      });
    });
  });

  describe('saveAndExecuteAction', () => {
    it('saves action', async () => {
      const { result } = renderHook(() => useActionSaveHandlers());
      await result.current.saveAndExecuteAction();
      expect(mockUpdateTool).toHaveBeenCalledWith({
        actions: [mockFocusedAction],
      });
    });

    it('does not execute action if save fails', async () => {
      (mockUpdateTool as jest.Mock).mockImplementation(() => mockApiErrorResponse);
      const { result } = renderHook(() => useActionSaveHandlers());
      await result.current.saveAndExecuteAction();
      expect(mockExecuteAction).not.toHaveBeenCalled();
    });

    it('executes action if save succeeds', async () => {
      (mockUpdateTool as jest.Mock).mockImplementation(() => mockApiSuccessResponse);
      const { result } = renderHook(() => useActionSaveHandlers());
      await result.current.saveAndExecuteAction();
      expect(mockExecuteAction).toHaveBeenCalledWith(mockFocusedAction);
    });
  });
});
