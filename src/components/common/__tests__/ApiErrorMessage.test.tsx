import { screen, render } from '@testing-library/react';
import { Typography } from '@mui/material';
import { mockApiError } from '@tests/constants/api';
import { ApiErrorMessage } from '../ApiErrorMessage';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Typography: jest.fn((props) => <ActualMui.Typography {...props} />),
  };
});

describe('ApiErrorMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error', () => {
    render(<ApiErrorMessage error={mockApiError} />);
    expect(screen.getByText(mockApiError.data.message)).toBeTruthy();
  });

  it('passes default body2 variant to Typography', () => {
    render(<ApiErrorMessage error={mockApiError} />);
    expect(Typography).toHaveBeenCalledWith(expect.objectContaining({ variant: 'body2' }), {});
  });

  it('passes custom variant to Typography', () => {
    render(<ApiErrorMessage error={mockApiError} variant="inherit" />);
    expect(Typography).toHaveBeenCalledWith(expect.objectContaining({ variant: 'inherit' }), {});
  });

  it('passes sx to Typography', () => {
    const mockSx = { width: '1000px' };
    render(<ApiErrorMessage error={mockApiError} sx={mockSx} />);
    expect(Typography).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
