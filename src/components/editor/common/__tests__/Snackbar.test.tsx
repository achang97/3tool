import { Alert } from '@mui/material';
import { render } from '@testing-library/react';
import { Snackbar } from '../Snackbar';

const mockMessage = 'message';

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
    const result = render(<Snackbar message={mockMessage} variant="success" />);
    expect(result.getByText(mockMessage)).toBeTruthy();
  });

  it('passes success variant as severity into Alert', () => {
    render(<Snackbar message={mockMessage} variant="success" />);
    expect(Alert as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
      {}
    );
  });
});
