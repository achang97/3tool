import { Stack } from '@mui/material';
import { screen, render } from '@testing-library/react';
import { ToolbarSection } from '../ToolbarSection';

const mockChildren = 'children';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Stack: jest.fn((props) => <ActualMui.Stack {...props} />),
  };
});

describe('ToolbarSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(<ToolbarSection>{mockChildren}</ToolbarSection>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('passes sx prop to Stack', () => {
    const mockSx = { width: '1000px' };
    render(<ToolbarSection sx={mockSx}>{mockChildren}</ToolbarSection>);
    expect(Stack).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
