import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { Action, ActionType, Component, ComponentType } from '@app/types';
import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { ReferenceUpdate } from '../useElementReferenceUpdate';
import { useUpdateElementName } from '../useUpdateElementName';

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

const mockReferenceUpdate: ReferenceUpdate = {
  actions: [],
  components: [],
};

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();
const mockHandleSuccess = jest.fn();
const mockExtendUpdate = jest.fn();

jest.mock('../useElementReferenceUpdate', () => ({
  useElementReferenceUpdate: jest.fn(() => () => mockReferenceUpdate),
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

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useUpdateElementName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validation', () => {
    it('displays error snackbar if new name does not match regex', async () => {
      const { result } = renderHook(() =>
        useUpdateElementName({
          prevName: mockPrevName,
          extendUpdate: mockExtendUpdate,
          onSuccess: mockHandleSuccess,
        })
      );
      await result.current('new-name!');

      expect(mockDispatch).toHaveBeenCalledWith(
        setSnackbarMessage({
          type: 'error',
          message: 'Name can only contain letters, numbers, _, or $',
        })
      );
    });

    it('displays error snackbar if new name matches name of another component', async () => {
      const { result } = renderHook(() =>
        useUpdateElementName({
          prevName: mockPrevName,
          extendUpdate: mockExtendUpdate,
          onSuccess: mockHandleSuccess,
        })
      );
      await result.current(mockComponents[0].name);

      expect(mockDispatch).toHaveBeenCalledWith(
        setSnackbarMessage({
          type: 'error',
          message: `A component or action with the name "${mockComponents[0].name}" already exists`,
        })
      );
    });

    it('displays error snackbar if new name matches name of another action', async () => {
      const { result } = renderHook(() =>
        useUpdateElementName({
          prevName: mockPrevName,
          extendUpdate: mockExtendUpdate,
          onSuccess: mockHandleSuccess,
        })
      );
      await result.current(mockActions[0].name);

      expect(mockDispatch).toHaveBeenCalledWith(
        setSnackbarMessage({
          type: 'error',
          message: `A component or action with the name "${mockActions[0].name}" already exists`,
        })
      );
    });
  });

  describe('API call', () => {
    it('calls API with extended update', async () => {
      mockExtendUpdate.mockImplementation(
        (newName: string, update: ReferenceUpdate) => {
          // @ts-ignore We're purposefully using a bogus field here
          update.randomField = newName;
        }
      );

      const { result } = renderHook(() =>
        useUpdateElementName({
          prevName: mockPrevName,
          extendUpdate: mockExtendUpdate,
          onSuccess: mockHandleSuccess,
        })
      );
      await result.current(mockNewName);

      expect(mockExtendUpdate).toHaveBeenCalledWith(
        mockNewName,
        mockReferenceUpdate
      );
      expect(mockUpdateTool).toHaveBeenCalledWith({
        ...mockReferenceUpdate,
        randomField: mockNewName,
      });
    });
  });

  describe('side effects', () => {
    describe('error', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiErrorResponse);
      });

      it('does not call onSuccess if API call fails', async () => {
        const { result } = renderHook(() =>
          useUpdateElementName({
            prevName: mockPrevName,
            extendUpdate: mockExtendUpdate,
            onSuccess: mockHandleSuccess,
          })
        );
        await result.current(mockNewName);
        expect(mockHandleSuccess).not.toHaveBeenCalled();
      });
    });

    describe('success', () => {
      beforeEach(() => {
        mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
      });

      it('calls onSuccess with new name and response if API call succeeds', async () => {
        const { result } = renderHook(() =>
          useUpdateElementName({
            prevName: mockPrevName,
            extendUpdate: mockExtendUpdate,
            onSuccess: mockHandleSuccess,
          })
        );
        await result.current(mockNewName);
        expect(mockHandleSuccess).toHaveBeenCalledWith(
          mockNewName,
          mockApiSuccessResponse
        );
      });
    });
  });
});
