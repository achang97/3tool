import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserAvatar } from '../UserAvatar';

const mockName = 'Andrew Chang';
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
    MockAvatar.mockClear();
  });

  it('renders first letter of name', () => {
    const result = render(<UserAvatar name={mockName} />);

    expect(result.getByText(mockName[0])).toBeTruthy();
  });

  it('shows tooltip of full name on hover', async () => {
    const result = render(<UserAvatar name={mockName} />);

    await userEvent.hover(result.getByText(mockName[0]));
    expect(await result.findByText(mockName)).toBeTruthy();
  });

  it('uses default size of 30', () => {
    render(<UserAvatar name={mockName} />);
    expect(MockAvatar).toHaveBeenCalledWith(
      expect.objectContaining({
        sx: expect.objectContaining({ width: 30, height: 30 }),
      })
    );
  });

  it('passes custom size to Avatar', () => {
    const mockSize = 200;
    render(<UserAvatar name={mockName} size={mockSize} />);
    expect(MockAvatar).toHaveBeenCalledWith(
      expect.objectContaining({
        sx: expect.objectContaining({ width: mockSize, height: mockSize }),
      })
    );
  });

  it('passes sx prop to Avatar', () => {
    const mockSx = { width: '1000px' };
    render(<UserAvatar name={mockName} sx={mockSx} />);
    expect(MockAvatar).toHaveBeenCalledWith(
      expect.objectContaining({ sx: expect.objectContaining(mockSx) })
    );
  });
});
