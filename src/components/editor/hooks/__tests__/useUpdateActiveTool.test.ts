import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useUpdateToolMutation } from '@app/redux/services/tools';
import { ApiError } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useGetActiveTool } from '../useGetActiveTool';
import { useUpdateActiveTool } from '../useUpdateActiveTool';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/redux/services/tools');

jest.mock('../useGetActiveTool');

describe('useUpdateActiveTool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
      mockUpdateTool,
      {},
    ]);
    mockUpdateTool.mockReset();
  });

  describe('returned function', () => {
    it('returns undefined and does not call updateTool if there is no active tool', async () => {
      (useGetActiveTool as jest.Mock).mockImplementation(() => undefined);
      const { result } = renderHook(useUpdateActiveTool);

      const response = await result.current({});
      expect(mockUpdateTool).not.toHaveBeenCalled();
      expect(response).toBeUndefined();
    });

    it('returns value of updateTool and calls updateTool if there is an active tool', async () => {
      const mockTool = { id: 1 };
      const mockUpdate = { name: 'hello ' };
      const mockResponse = { data: mockTool };
      mockUpdateTool.mockImplementation(() => mockResponse);

      (useGetActiveTool as jest.Mock).mockImplementation(() => mockTool);
      const { result } = renderHook(useUpdateActiveTool);

      const response = await result.current(mockUpdate);
      expect(mockUpdateTool).toHaveBeenCalled();
      expect(response).toEqual(mockResponse);
    });
  });

  describe('error', () => {
    it('does not set snackbar error message if there is no error', () => {
      (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
        mockUpdateTool,
        { error: undefined },
      ]);

      renderHook(useUpdateActiveTool);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('sets snackbar error message on error', () => {
      const mockError: ApiError = {
        status: 400,
        data: {
          message: 'Error Message',
        },
      };
      (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
        mockUpdateTool,
        { error: mockError },
      ]);

      renderHook(useUpdateActiveTool);
      expect(mockDispatch).toHaveBeenCalledWith(
        setSnackbarMessage({ type: 'error', message: 'Error Message' })
      );
    });
  });
});
