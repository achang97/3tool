import { renderHook } from '@testing-library/react';
import { useEnqueueSnackbar } from '../useEnqueueSnackbar';

const mockEnqueueSnackbar = jest.fn();
const mockMessage = 'message';

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  })),
}));

describe('useEnqueueSnackbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enqueues snackbar with message', () => {
    const { result } = renderHook(() => useEnqueueSnackbar());
    result.current(mockMessage, { variant: 'success' });
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(mockMessage, expect.any(Object));
  });

  it('enqueues snackbar content with correct options', () => {
    const { result } = renderHook(() => useEnqueueSnackbar());
    result.current(mockMessage, { variant: 'success' });

    const { content } = mockEnqueueSnackbar.mock.calls[0][1];

    const contentResult = content('');
    expect(contentResult.props).toEqual({
      message: mockMessage,
      variant: 'success',
    });
  });
});
