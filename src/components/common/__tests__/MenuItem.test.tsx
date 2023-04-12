import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { MenuItem } from '../MenuItem';

const mockIcon = 'icon';
const mockLabel = 'label';
const mockColor = 'red';

const mockHref = '/settings';
const mockHandleClick = jest.fn();

describe('MenuItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders icon', () => {
    render(<MenuItem icon={mockIcon} label={mockLabel} color={mockColor} />);
    expect(screen.getByText(mockIcon)).toBeTruthy();
  });

  it('renders label', () => {
    render(<MenuItem icon={mockIcon} label={mockLabel} color={mockColor} />);
    expect(screen.getByText(mockLabel)).toBeTruthy();
  });

  it('passes color style into container', () => {
    const result = render(<MenuItem icon={mockIcon} label={mockLabel} color={mockColor} />);
    expect(result.container.firstChild).toHaveStyle({ color: mockColor });
  });

  it('calls on click', async () => {
    render(
      <MenuItem icon={mockIcon} label={mockLabel} color={mockColor} onClick={mockHandleClick} />
    );
    await userEvent.click(screen.getByText(mockLabel));
    expect(mockHandleClick).toHaveBeenCalled();
  });

  it('adds href prop to item', async () => {
    const result = render(
      <MenuItem icon={mockIcon} label={mockLabel} color={mockColor} href={mockHref} />
    );
    expect(result.container.firstChild).toHaveProperty('href', `${BASE_WINDOW_URL}${mockHref}`);
  });
});
