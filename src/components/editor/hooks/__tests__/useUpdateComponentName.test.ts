import { renameComponentInput } from '@app/redux/features/activeToolSlice';
import { focusComponent } from '@app/redux/features/editorSlice';
import { Action, ActionType, Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { useUpdateComponentName } from '../useUpdateComponentName';

const mockPrevName = 'button1';
const mockNewName = 'newButton';

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

describe('useUpdateComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API call', () => {
    it('updates name of current component', async () => {
      const { result } = renderHook(() => useUpdateComponentName(mockPrevName));
      await result.current(mockNewName);

      expect(mockUpdateTool).toHaveBeenCalled();
      expect(mockUpdateTool.mock.calls[0][0].components[0]).toMatchObject({
        name: mockNewName,
      });
    });
  });

  describe('side effects', () => {
    describe('error', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiErrorResponse);
      });

      it('does not focus component or rename component inputs if API call fails', async () => {
        const { result } = renderHook(() =>
          useUpdateComponentName(mockPrevName)
        );
        await result.current(mockNewName);

        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    describe('success', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
      });

      it('focuses component with new name if API call succeeds', async () => {
        const { result } = renderHook(() =>
          useUpdateComponentName(mockPrevName)
        );
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(focusComponent(mockNewName));
      });

      it('renames component inputs with new name if API call succeeds', async () => {
        const { result } = renderHook(() =>
          useUpdateComponentName(mockPrevName)
        );
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(
          renameComponentInput({ prevName: mockPrevName, newName: mockNewName })
        );
      });
    });
  });
});
