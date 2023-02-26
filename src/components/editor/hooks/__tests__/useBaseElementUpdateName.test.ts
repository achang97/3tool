import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { ReferenceUpdate } from '../useToolUpdateReference';
import { useBaseElementUpdateName } from '../useBaseElementUpdateName';

const mockPrevName = 'button1';
const mockNewName = 'newButton';

const mockElementNames = ['button1', 'button2'];
const mockReferenceUpdate: ReferenceUpdate = {
  actions: [],
  components: [],
};

const mockUpdateTool = jest.fn();
const mockHandleSuccess = jest.fn();
const mockExtendUpdate = jest.fn();
const mockEnqueueSnackbar = jest.fn();

jest.mock('../useToolUpdateReference', () => ({
  useToolUpdateReference: jest.fn(() => () => mockReferenceUpdate),
}));

jest.mock('../useToolElementNames', () => ({
  useToolElementNames: jest.fn(() => mockElementNames),
}));

jest.mock('../useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => mockEnqueueSnackbar),
}));

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    updateTool: mockUpdateTool,
  })),
}));

describe('useBaseElementUpdateName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validation', () => {
    it('displays error snackbar if new name does not match regex', async () => {
      const { result } = renderHook(() =>
        useBaseElementUpdateName({
          prevName: mockPrevName,
          extendUpdate: mockExtendUpdate,
          onSuccess: mockHandleSuccess,
        })
      );
      await result.current('new-name!');

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Name can only contain letters, numbers, _, or $',
        { variant: 'error' }
      );
    });

    it('displays error snackbar if new name matches name of another element', async () => {
      const { result } = renderHook(() =>
        useBaseElementUpdateName({
          prevName: mockPrevName,
          extendUpdate: mockExtendUpdate,
          onSuccess: mockHandleSuccess,
        })
      );
      await result.current(mockElementNames[0]);

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        `A component or action with the name "${mockElementNames[0]}" already exists`,
        { variant: 'error' }
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
        useBaseElementUpdateName({
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
          useBaseElementUpdateName({
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
          useBaseElementUpdateName({
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
