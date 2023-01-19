import {
  setSnackbarMessage,
  SnackbarMessage,
} from '@app/redux/features/editorSlice';
import { useAppSelector } from '@app/redux/hooks';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { DURATION_MS, EditorSnackbar } from '../EditorSnackbar';

const mockDispatch = jest.fn();
const mockSnackbarMessage: SnackbarMessage = {
  type: 'success',
  message: 'Hello',
};

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(),
}));

describe('EditorSnackbar', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders alert', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      snackbarMessage: mockSnackbarMessage,
    }));

    const result = render(<EditorSnackbar />);
    expect(result.getByText(mockSnackbarMessage.message)).toBeDefined();
  });

  it('hides alert after 3 seconds', async () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      snackbarMessage: mockSnackbarMessage,
    }));

    const result = render(<EditorSnackbar />);
    expect(result.getByText(mockSnackbarMessage.message)).toBeDefined();

    await act(async () => {
      jest.advanceTimersByTime(DURATION_MS);
    });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setSnackbarMessage(undefined));
    });
  });

  it('renders nothing if snackbar message is undefined', () => {
    (useAppSelector as jest.Mock).mockImplementation(() => ({
      snackbarMessage: undefined,
    }));

    const result = render(<EditorSnackbar />);
    expect(result.queryByTestId('editor-snackbar')).toBeNull();
  });
});
