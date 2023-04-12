import { Box } from '@mui/material';
import { screen, render } from '@testing-library/react';
import { PageContainer } from '../PageContainer';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Box: jest.fn((props) => <ActualMui.Box {...props} />),
  };
});

const mockChildren = 'children';

describe('PageContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(<PageContainer>{mockChildren}</PageContainer>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('passes sx prop to Box', () => {
    const mockSx = { width: '1000px' };
    render(<PageContainer sx={mockSx}>{mockChildren}</PageContainer>);
    expect(Box).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
