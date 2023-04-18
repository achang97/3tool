import { Alert } from '@mui/material';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Snackbar } from '../Snackbar';

const mockMessage = 'message';
const mockHandleClose = jest.fn();

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Alert: jest.fn((props) => <ActualMui.Alert {...props} />),
  };
});

describe('Snackbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message', () => {
    render(<Snackbar message={mockMessage} variant="success" onClose={mockHandleClose} />);
    expect(screen.getByText(mockMessage)).toBeTruthy();
  });

  it('passes success variant as severity into Alert', () => {
    render(<Snackbar message={mockMessage} variant="success" onClose={mockHandleClose} />);
    expect(Alert as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
      {}
    );
  });

  it('renders action', () => {
    const mockAction = 'action';
    render(
      <Snackbar
        message={mockMessage}
        variant="success"
        action={mockAction}
        onClose={mockHandleClose}
      />
    );
    expect(screen.getByText(mockAction)).toBeTruthy();
  });

  it('does not render close button if not persisted', () => {
    render(
      <Snackbar message={mockMessage} variant="success" onClose={mockHandleClose} persist={false} />
    );
    expect(screen.queryByTestId('snackbar-close-button')).toBeNull();
  });

  it('renders close button if persisted', async () => {
    render(<Snackbar message={mockMessage} variant="success" onClose={mockHandleClose} persist />);
    await userEvent.click(screen.getByTestId('snackbar-close-button'));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
