import { renameActionResult } from '@app/redux/features/activeToolSlice';
import { focusAction } from '@app/redux/features/editorSlice';
import { Action, ActionType, Component } from '@app/types';
import { mockApiErrorResponse } from '@tests/constants/api';
import { renderHook } from '@tests/utils/renderWithContext';
import { useActionUpdateName } from '../useActionUpdateName';

const mockPrevName = 'action1';
const mockNewName = 'newAction';

const mockComponents: Component[] = [];
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

jest.mock('../useToolUpdateReference', () => ({
  useToolUpdateReference: jest.fn(() => () => ({
    components: mockComponents,
    actions: mockActions,
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useActionUpdateName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API call', () => {
    it('updates name of current action', async () => {
      const { result } = renderHook(() => useActionUpdateName(mockPrevName));
      await result.current(mockNewName);

      expect(mockUpdateTool).toHaveBeenCalled();
      expect(mockUpdateTool.mock.calls[0][0].actions[0]).toMatchObject({
        name: mockNewName,
      });
    });
  });

  describe('side effects', () => {
    describe('error', () => {
      it('does not focus action if API call fails', async () => {
        mockUpdateTool.mockImplementation(() => mockApiErrorResponse);

        const { result } = renderHook(() => useActionUpdateName(mockPrevName));
        await result.current(mockNewName);

        expect(mockDispatch).not.toHaveBeenCalled();
      });

      it('does not focus action if API response does not include updated action', async () => {
        mockUpdateTool.mockImplementation(() => ({
          data: { actions: [] },
        }));

        const { result } = renderHook(() => useActionUpdateName(mockPrevName));
        await result.current(mockNewName);

        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    describe('success', () => {
      const mockAction = {
        type: ActionType.Javascript,
        name: mockNewName,
        data: {},
      } as Action;

      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => ({
          data: { actions: [mockAction] },
        }));
      });

      it('focuses action with new name if API call succeeds', async () => {
        const { result } = renderHook(() => useActionUpdateName(mockPrevName));
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(focusAction(mockAction));
      });

      it('renames action result entry if API call succeeds', async () => {
        const { result } = renderHook(() => useActionUpdateName(mockPrevName));
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(
          renameActionResult({ prevName: mockPrevName, newName: mockNewName })
        );
      });
    });
  });
});
