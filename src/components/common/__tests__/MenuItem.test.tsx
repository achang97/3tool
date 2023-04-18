import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { MenuItem } from '../MenuItem';

const mockIcon = 'icon';
const mockLabel = 'label';
const mockColor = 'red';

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

  it('adds href and target prop to link item', async () => {
    const mockHref = '/settings';
    const mockTarget = '_blank';
    const result = render(
      <MenuItem
        icon={mockIcon}
        label={mockLabel}
        color={mockColor}
        href={mockHref}
        target={mockTarget}
      />
    );
    expect(result.container.firstChild).toHaveProperty('href', `${BASE_WINDOW_URL}${mockHref}`);
    expect(result.container.firstChild).toHaveProperty('target', mockTarget);
  });
});
