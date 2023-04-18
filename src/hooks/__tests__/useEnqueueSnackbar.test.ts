import { screen, render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEnqueueSnackbar } from '../useEnqueueSnackbar';

const mockEnqueueSnackbar = jest.fn();
const mockCloseSnackbar = jest.fn();
const mockMessage = 'message';
const mockKey = 'key';

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: mockEnqueueSnackbar,
    closeSnackbar: mockCloseSnackbar,
  })),
}));

describe('useEnqueueSnackbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enqueues snackbar with message', () => {
    const { result } = renderHook(() => useEnqueueSnackbar());
    result.current(mockMessage, { variant: 'success' });

    const { content } = mockEnqueueSnackbar.mock.calls[0][1];
    render(content(mockKey));
    expect(screen.getByText(mockMessage)).toBeTruthy();
  });

  it('enqueues snackbar with action', () => {
    const mockAction = 'action';
    const { result } = renderHook(() => useEnqueueSnackbar());
    result.current(mockMessage, { variant: 'success', action: mockAction });

    const { content } = mockEnqueueSnackbar.mock.calls[0][1];
    render(content(mockKey));
    expect(screen.getByText(mockAction)).toBeTruthy();
  });

  it('enqueues persisted snackbar with close button', async () => {
    const { result } = renderHook(() => useEnqueueSnackbar());
    result.current(mockMessage, { variant: 'success', persist: true });

    const { content } = mockEnqueueSnackbar.mock.calls[0][1];
    render(content(mockKey));
    await userEvent.click(screen.getByTestId('snackbar-close-button'));
    expect(mockCloseSnackbar).toHaveBeenCalledWith(mockKey);
  });

  it('enqueues non-persisted snackbar without close button', async () => {
    const { result } = renderHook(() => useEnqueueSnackbar());
    result.current(mockMessage, { variant: 'success', persist: false });

    const { content } = mockEnqueueSnackbar.mock.calls[0][1];
    render(content(mockKey));
    expect(screen.queryByTestId('snackbar-close-button')).toBeNull();
  });
});
