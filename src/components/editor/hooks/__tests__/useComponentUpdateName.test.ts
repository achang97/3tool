import { renameComponentInput } from '@app/redux/features/activeToolSlice';
import { focusAction, focusComponent } from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { Action, ActionType, Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { useComponentUpdateName } from '../useComponentUpdateName';

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
const mockActions: Action[] = [];

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();
const mockUpdateElementReference = jest.fn((element) => ({
  ...element,
  newField: 'test',
}));

jest.mock('../useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

jest.mock('../useToolUpdateReference', () => ({
  useToolUpdateReference: jest.fn(() => () => ({
    components: mockComponents,
    actions: mockActions,
  })),
}));

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
      actions: mockActions,
    },
    updateTool: mockUpdateTool,
  })),
}));

jest.mock('../useElementUpdateReference', () => ({
  useElementUpdateReference: jest.fn(() => mockUpdateElementReference),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useComponentUpdateName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => ({}));
  });

  describe('API call', () => {
    it('updates name of current component', async () => {
      const { result } = renderHook(() => useComponentUpdateName(mockPrevName));
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
          useComponentUpdateName(mockPrevName)
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
          useComponentUpdateName(mockPrevName)
        );
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(focusComponent(mockNewName));
      });

      it('renames component inputs with new name if API call succeeds', async () => {
        const { result } = renderHook(() =>
          useComponentUpdateName(mockPrevName)
        );
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(
          renameComponentInput({ prevName: mockPrevName, newName: mockNewName })
        );
      });

      it('updates focused action', async () => {
        const mockAction = {
          type: ActionType.Javascript,
          name: 'action1',
          data: {},
        };
        (useAppSelector as jest.Mock).mockImplementation(() => ({
          focusedAction: mockAction,
        }));

        const { result } = renderHook(() =>
          useComponentUpdateName(mockPrevName)
        );
        await result.current(mockNewName);

        expect(mockDispatch).toHaveBeenCalledWith(
          focusAction(mockUpdateElementReference(mockAction))
        );
      });
    });
  });
});
