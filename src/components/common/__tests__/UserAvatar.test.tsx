import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockUser } from '@tests/constants/data';
import { UserAvatar } from '../UserAvatar';

const MockAvatar = jest.fn();

jest.mock('@mui/material', () => {
  const ActualMui = jest.requireActual('@mui/material');
  const { forwardRef } = jest.requireActual('react');
  return {
    ...ActualMui,
    // @ts-ignore No need to define types in test
    Avatar: forwardRef((props, ref) => {
      MockAvatar(props);
      return <ActualMui.Avatar {...props} ref={ref} />;
    }),
  };
});

describe('UserAvatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MockAvatar.mockClear();
  });

  it('renders first letter of name', () => {
    render(<UserAvatar user={mockUser} />);

    expect(screen.getByText(mockUser.firstName[0])).toBeTruthy();
  });

  it('shows tooltip of full name on hover', async () => {
    render(<UserAvatar user={mockUser} />);

    await userEvent.hover(screen.getByText(mockUser.firstName[0]));
    expect(await screen.findByText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeTruthy();
  });

  it('uses default size of 30', () => {
    render(<UserAvatar user={mockUser} />);
    expect(MockAvatar).toHaveBeenCalledWith(
      expect.objectContaining({
        sx: expect.objectContaining({ width: 30, height: 30 }),
      })
    );
  });

  it('passes custom size to Avatar', () => {
    const mockSize = 200;
    render(<UserAvatar user={mockUser} size={mockSize} />);
    expect(MockAvatar).toHaveBeenCalledWith(
      expect.objectContaining({
        sx: expect.objectContaining({ width: mockSize, height: mockSize }),
      })
    );
  });

  it('passes sx prop to Avatar', () => {
    const mockSx = { width: '1000px' };
    render(<UserAvatar user={mockUser} sx={mockSx} />);
    expect(MockAvatar).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) })
    );
  });
});
