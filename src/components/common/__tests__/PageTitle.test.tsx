import { Typography } from '@mui/material';
import { render } from '@testing-library/react';
import { PageTitle } from '../PageTitle';

const mockTitle = 'Title';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Typography: jest.fn((props) => <ActualMui.Typography {...props} />),
  };
});

describe('PageTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const result = render(<PageTitle>{mockTitle}</PageTitle>);
    expect(result.getByText(mockTitle)).toBeTruthy();
  });

  it('passes sx prop to Typography', () => {
    const mockSx = { padding: 3, width: '1000px' };
    render(<PageTitle sx={mockSx}>{mockTitle}</PageTitle>);
    expect(Typography).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });
});
