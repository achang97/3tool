import { render } from '@testing-library/react';
import { MenuItemContent } from '../MenuItemContent';

const mockIcon = 'icon';
const mockText = 'text';
const mockColor = 'red';

describe('MenuItemContent', () => {
  it('renders icon', () => {
    const result = render(
      <MenuItemContent icon={mockIcon} text={mockText} color={mockColor} />
    );
    expect(result.getByText(mockIcon)).toBeTruthy();
  });

  it('renders text', () => {
    const result = render(
      <MenuItemContent icon={mockIcon} text={mockText} color={mockColor} />
    );
    expect(result.getByText(mockText)).toBeTruthy();
  });

  it('passes color style into container', () => {
    const result = render(
      <MenuItemContent icon={mockIcon} text={mockText} color={mockColor} />
    );
    expect(result.container.firstChild).toHaveStyle({ color: mockColor });
  });
});
