import { resetComponentInput } from '@app/redux/features/activeToolSlice';
import { blurComponent } from '@app/redux/features/editorSlice';
import { Component } from '@app/types';
import { renderHook } from '@testing-library/react';
import { mockApiErrorResponse, mockApiSuccessResponse } from '@tests/constants/api';
import { useComponentDelete } from '../useComponentDelete';

const mockName = 'name';

const mockComponents = [{ name: mockName }, { name: 'other-name' }] as Component[];

const mockUpdateTool = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
    },
    updateTool: mockUpdateTool,
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useComponentDelete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API to update tool with updated components', async () => {
    const { result } = renderHook(() => useComponentDelete(mockName));
    await result.current();
    expect(mockUpdateTool).toHaveBeenCalledWith({
      components: [{ name: 'other-name' }],
    });
  });

  describe('error', () => {
    beforeEach(() => {
      mockUpdateTool.mockImplementation(() => mockApiErrorResponse);
    });

    it('returns false if deletion fails', async () => {
      const { result } = renderHook(() => useComponentDelete(mockName));
      expect(await result.current()).toEqual(false);
    });

    it('does not blur or reset component if deletion fails', async () => {
      const { result } = renderHook(() => useComponentDelete(mockName));
      await result.current();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    beforeEach(() => {
      mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
    });

    it('returns true if deletion succeeds', async () => {
      const { result } = renderHook(() => useComponentDelete(mockName));
      expect(await result.current()).toEqual(true);
    });

    it('blurs and resets component if deletion succeeds', async () => {
      const { result } = renderHook(() => useComponentDelete(mockName));
      await result.current();
      expect(mockDispatch).toHaveBeenCalledWith(blurComponent());
      expect(mockDispatch).toHaveBeenCalledWith(resetComponentInput(mockName));
    });
  });
});
