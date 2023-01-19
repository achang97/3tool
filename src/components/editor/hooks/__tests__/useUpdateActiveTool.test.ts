import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useUpdateToolMutation } from '@app/redux/services/tools';
import { ApiError } from '@app/types';
import { renderHook } from '@testing-library/react';
import { useUpdateActiveTool } from '../useUpdateActiveTool';

const mockDispatch = jest.fn();
const mockUpdateTool = jest.fn();

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('@app/redux/services/tools');

describe('useUpdateActiveTool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateToolMutation as jest.Mock).mockImplementation(() => [
      mockUpdateTool,
      {},
    ]);
  });

  it('returns function to updateTool', () => {
    const { result } = renderHook(useUpdateActiveTool);
    expect(result.current).toEqual(mockUpdateTool);
  });

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
