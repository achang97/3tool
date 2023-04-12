import { Box } from '@mui/material';
import { screen, render } from '@testing-library/react';
import { EditorToolbar } from '../EditorToolbar';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Box: jest.fn((props) => <ActualMui.Box {...props} />),
  };
});

const mockChildren = 'children';

describe('EditorToolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(<EditorToolbar>{mockChildren}</EditorToolbar>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('passes sx prop to Box', () => {
    const mockSx = { width: '1000px' };
    render(<EditorToolbar sx={mockSx}>{mockChildren}</EditorToolbar>);
    expect(Box).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
