import { Box } from '@mui/material';
import { screen, render } from '@testing-library/react';
import { FormContainer } from '../FormContainer';

const mockChildren = 'children';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Box: jest.fn((props) => <ActualMui.Box {...props} />),
  };
});

describe('FormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(<FormContainer>{mockChildren}</FormContainer>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('passes sx prop to Box', () => {
    const mockSx = { width: '1000px' };
    render(<FormContainer sx={mockSx}>{mockChildren}</FormContainer>);
    expect(Box).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
