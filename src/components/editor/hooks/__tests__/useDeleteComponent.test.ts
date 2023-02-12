import { resetComponentInput } from '@app/redux/features/activeToolSlice';
import { blurComponentFocus } from '@app/redux/features/editorSlice';
import { Component, Tool } from '@app/types';
import { renderHook } from '@testing-library/react';
import {
  mockApiErrorResponse,
  mockApiSuccessResponse,
} from '@tests/constants/api';
import { mockTool as baseMockTool } from '@tests/constants/data';
import { useDeleteComponent } from '../useDeleteComponent';

const mockName = 'name';

const mockComponents = [
  { name: mockName },
  { name: 'other-name' },
] as Component[];
const mockTool: Tool = {
  ...baseMockTool,
  components: mockComponents,
};

const mockUpdateTool = jest.fn();
const mockDispatch = jest.fn();

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      ...mockTool,
      components: [{ name: mockName }, { name: 'other-name' }],
    },
    updateTool: mockUpdateTool,
  })),
}));

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('useDeleteComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API to update tool with updated components', async () => {
    const { result } = renderHook(() => useDeleteComponent(mockName));
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
      const { result } = renderHook(() => useDeleteComponent(mockName));
      expect(await result.current()).toEqual(false);
    });

    it('does not blur or reset component if deletion fails', async () => {
      const { result } = renderHook(() => useDeleteComponent(mockName));
      await result.current();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    beforeEach(() => {
      mockUpdateTool.mockImplementation(() => mockApiSuccessResponse);
    });

    it('returns true if deletion succeeds', async () => {
      const { result } = renderHook(() => useDeleteComponent(mockName));
      expect(await result.current()).toEqual(true);
    });

    it('blurs and resets component if deletion succeeds', async () => {
      const { result } = renderHook(() => useDeleteComponent(mockName));
      await result.current();
      expect(mockDispatch).toHaveBeenCalledWith(blurComponentFocus());
      expect(mockDispatch).toHaveBeenCalledWith(resetComponentInput(mockName));
    });
  });
});
