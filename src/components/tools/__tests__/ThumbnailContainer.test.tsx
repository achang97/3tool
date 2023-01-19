import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThumbnailContainer } from '../ThumbnailContainer';

const mockIcon = 'icon';
const mockChildren = 'children';
const mockHandleClick = jest.fn();

describe('ThumbnailContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const result = render(
      <ThumbnailContainer icon={mockIcon} onClick={mockHandleClick}>
        {mockChildren}
      </ThumbnailContainer>
    );

    expect(result.getByText(mockIcon)).toBeDefined();
  });

  it('renders children', () => {
    const result = render(
      <ThumbnailContainer icon={mockIcon} onClick={mockHandleClick}>
        {mockChildren}
      </ThumbnailContainer>
    );

    expect(result.getByText(mockChildren)).toBeDefined();
  });

  it('calls onClick when container is clicked', async () => {
    const result = render(
      <ThumbnailContainer icon={mockIcon} onClick={mockHandleClick}>
        {mockChildren}
      </ThumbnailContainer>
    );

    await userEvent.click(result.getByText(mockChildren));
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
});
