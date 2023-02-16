import { focusAction } from '@app/redux/features/editorSlice';
import { Action, ActionType, Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { useUpdateActionName } from '../useUpdateActionName';

const mockPrevName = 'action1';
const mockNewName = 'newAction';

const mockComponents = [
  {
    type: ComponentType.Button,
    name: 'button1',
    data: {
      button: {
        text: '{{ button1.disabled }}',
      },
    },
  },
] as unknown as Component[];

const mockActions = [
  {
    type: ActionType.Javascript,
    name: 'action1',
    data: {},
  },
] as Action[];

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
      actions: mockActions,
    },
    updateTool: mockUpdateTool,
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useUpdateActionName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API call', () => {
    it('updates name of current action', async () => {
      const { result } = renderHook(() => useUpdateActionName(mockPrevName));
      await result.current(mockNewName);

      expect(mockUpdateTool).toHaveBeenCalled();
      expect(mockUpdateTool.mock.calls[0][0].actions[0]).toMatchObject({
        name: mockNewName,
      });
    });
  });

  describe('side effects', () => {
    describe('error', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiErrorResponse);
      });

      it('does not focus action if API call fails', async () => {
        const { result } = renderHook(() => useUpdateActionName(mockPrevName));
        await result.current(mockNewName);

        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    describe('success', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
      });

      it('focuses action with new name if API call succeeds', async () => {
        const { result } = renderHook(() => useUpdateActionName(mockPrevName));
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(focusAction(mockNewName));
      });
    });
  });
});
