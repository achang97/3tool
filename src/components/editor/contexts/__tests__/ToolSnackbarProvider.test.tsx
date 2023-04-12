import { screen, render } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { ToolSnackbarProvider } from '../ToolSnackbarProvider';

const mockChildren = 'children';

jest.mock('notistack', () => {
  const ActualNotistack = jest.requireActual('notistack');
  return {
    SnackbarProvider: jest.fn((props) => <ActualNotistack.SnackbarProvider {...props} />),
  };
});

describe('ToolSnackbarProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(<ToolSnackbarProvider>{mockChildren}</ToolSnackbarProvider>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('passes duration of 3000 ms to base SnackbarProvider', () => {
    render(<ToolSnackbarProvider>{mockChildren}</ToolSnackbarProvider>);
    expect(SnackbarProvider).toHaveBeenCalledWith(
      expect.objectContaining({ autoHideDuration: 3000 }),
      {}
    );
  });

  it('passes anchor origin settings to base SnackbarProvider', () => {
    render(<ToolSnackbarProvider>{mockChildren}</ToolSnackbarProvider>);
    expect(SnackbarProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      }),
      {}
    );
  });

  it('passes max snack of 3 to base SnackbarProvider', () => {
    render(<ToolSnackbarProvider>{mockChildren}</ToolSnackbarProvider>);
    expect(SnackbarProvider).toHaveBeenCalledWith(expect.objectContaining({ maxSnack: 3 }), {});
  });
});
