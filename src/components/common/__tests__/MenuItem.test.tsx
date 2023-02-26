import { render } from '@testing-library/react';
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
    const result = render(
      <MenuItem icon={mockIcon} label={mockLabel} color={mockColor} />
    );
    expect(result.getByText(mockIcon)).toBeTruthy();
  });

  it('renders label', () => {
    const result = render(
      <MenuItem icon={mockIcon} label={mockLabel} color={mockColor} />
    );
    expect(result.getByText(mockLabel)).toBeTruthy();
  });

  it('passes color style into container', () => {
    const result = render(
      <MenuItem icon={mockIcon} label={mockLabel} color={mockColor} />
    );
    expect(result.container.firstChild).toHaveStyle({ color: mockColor });
  });

  it('calls on click', async () => {
    const result = render(
      <MenuItem
        icon={mockIcon}
        label={mockLabel}
        color={mockColor}
        onClick={mockHandleClick}
      />
    );
    await userEvent.click(result.getByText(mockLabel));
    expect(mockHandleClick).toHaveBeenCalled();
  });

  it('adds href prop to item', async () => {
    const result = render(
      <MenuItem
        icon={mockIcon}
        label={mockLabel}
        color={mockColor}
        href={mockHref}
      />
    );
    expect(result.container.firstChild).toHaveProperty(
      'href',
      `${BASE_WINDOW_URL}${mockHref}`
    );
  });
});
