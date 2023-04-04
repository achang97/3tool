import { render } from '@testing-library/react';
import { Typography } from '@mui/material';
import { ApiErrorMessage } from '../ApiErrorMessage';

const mockApiError = {
  status: 400,
  data: {
    message: 'Error message',
  },
};

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
    const result = render(<ApiErrorMessage error={mockApiError} />);
    expect(result.getByText(mockApiError.data.message)).toBeTruthy();
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
