import { screen, render } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { AppSnackbarProvider } from '../AppSnackbarProvider';

const mockChildren = 'children';

jest.mock('notistack', () => {
  const ActualNotistack = jest.requireActual('notistack');
  return {
    SnackbarProvider: jest.fn((props) => <ActualNotistack.SnackbarProvider {...props} />),
  };
});

describe('AppSnackbarProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(<AppSnackbarProvider>{mockChildren}</AppSnackbarProvider>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('passes duration of 3000 ms to base SnackbarProvider', () => {
    render(<AppSnackbarProvider>{mockChildren}</AppSnackbarProvider>);
    expect(SnackbarProvider).toHaveBeenCalledWith(
      expect.objectContaining({ autoHideDuration: 3000 }),
      {}
    );
  });

  it('passes anchor origin settings to base SnackbarProvider', () => {
    render(<AppSnackbarProvider>{mockChildren}</AppSnackbarProvider>);
    expect(SnackbarProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      }),
      {}
    );
  });

  it('passes max snack of 3 to base SnackbarProvider', () => {
    render(<AppSnackbarProvider>{mockChildren}</AppSnackbarProvider>);
    expect(SnackbarProvider).toHaveBeenCalledWith(expect.objectContaining({ maxSnack: 3 }), {});
  });
});
