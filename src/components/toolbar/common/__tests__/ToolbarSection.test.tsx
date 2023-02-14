import { Box } from '@mui/material';
import { render } from '@testing-library/react';
import { ToolbarSection } from '../ToolbarSection';

const mockChildren = 'children';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Box: jest.fn((props) => <ActualMui.Box {...props} />),
  };
});

describe('ToolbarSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const result = render(<ToolbarSection>{mockChildren}</ToolbarSection>);
    expect(result.getByText(mockChildren)).toBeTruthy();
  });

  it('passes sx prop to Box', () => {
    const mockSx = { width: '1000px' };
    render(<ToolbarSection sx={mockSx}>{mockChildren}</ToolbarSection>);
    expect(Box).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
