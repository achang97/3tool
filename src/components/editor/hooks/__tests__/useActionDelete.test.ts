import { resetActionResult } from '@app/redux/features/activeToolSlice';
import { blurAction } from '@app/redux/features/editorSlice';
import { Action } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockApiErrorResponse, mockApiSuccessResponse } from '@tests/constants/api';
import { useActionDelete } from '../useActionDelete';

const mockName = 'name';

const mockActions = [{ name: mockName }, { name: 'other-name' }] as Action[];

const mockUpdateTool = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      actions: mockActions,
    },
    updateTool: mockUpdateTool,
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useActionDelete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API to update tool with updated actions', async () => {
    const { result } = renderHook(() => useActionDelete(mockName));
    await result.current();
    expect(mockUpdateTool).toHaveBeenCalledWith({
      actions: [{ name: 'other-name' }],
    });
  });

  describe('error', () => {
    beforeEach(() => {
      mockUpdateTool.mockImplementation(() => mockApiErrorResponse);
    });

    it('returns false if deletion fails', async () => {
      const { result } = renderHook(() => useActionDelete(mockName));
      expect(await result.current()).toEqual(false);
    });

    it('does not blur action if deletion fails', async () => {
      const { result } = renderHook(() => useActionDelete(mockName));
      await result.current();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    beforeEach(() => {
      mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
    });

    it('returns true if deletion succeeds', async () => {
      const { result } = renderHook(() => useActionDelete(mockName));
      expect(await result.current()).toEqual(true);
    });

    it('blurs action if deletion succeeds', async () => {
      const { result } = renderHook(() => useActionDelete(mockName));
      await result.current();
      expect(mockDispatch).toHaveBeenCalledWith(blurAction());
    });

    it('resets action result if deletion succeeds', async () => {
      const { result } = renderHook(() => useActionDelete(mockName));
      await result.current();
      expect(mockDispatch).toHaveBeenCalledWith(resetActionResult(mockName));
    });
  });
});
