import { Stack } from '@mui/material';
import { screen, render } from '@testing-library/react';
import { PageContainer } from '../PageContainer';
import { SideNavProps } from '../SideNav';

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  return {
    ...ActualMui,
    Stack: jest.fn((props) => <ActualMui.Stack {...props} />),
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

  it('passes sx prop to Stack', () => {
    const mockSx = { width: '1000px' };
    render(<PageContainer sx={mockSx}>{mockChildren}</PageContainer>);
    expect(Stack).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) }),
      {}
    );
  });

  it('renders SideNav if sideNavConfig prop is passed', () => {
    const sideNavConfig: SideNavProps['config'] = [
      {
        heading: 'Settings',
        items: [{ type: 'link', children: 'Team', href: '/settings/team' }],
      },
    ];
    render(<PageContainer sideNavConfig={sideNavConfig}>{mockChildren}</PageContainer>);

    expect(screen.getByRole('heading', { name: /settings/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /team/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /team/i })).toHaveAttribute('href', '/settings/team');
  });
});
