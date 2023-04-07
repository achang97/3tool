import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { ThumbnailContainer } from '../ThumbnailContainer';

const mockIcon = 'icon';
const mockChildren = 'children';

describe('ThumbnailContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const result = render(
      <ThumbnailContainer icon={mockIcon}>{mockChildren}</ThumbnailContainer>
    );

    expect(result.getByText(mockIcon)).toBeTruthy();
  });

  it('renders children', () => {
    const result = render(
      <ThumbnailContainer icon={mockIcon}>{mockChildren}</ThumbnailContainer>
    );

    expect(result.getByText(mockChildren)).toBeTruthy();
  });

  it('calls onClick when container is clicked', async () => {
    const mockHandleClick = jest.fn();
    const result = render(
      <ThumbnailContainer icon={mockIcon} onClick={mockHandleClick}>
        {mockChildren}
      </ThumbnailContainer>
    );

    await userEvent.click(result.getByText(mockChildren));
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it('adds href prop to item', async () => {
    const mockHref = '/test';
    const result = render(
      <ThumbnailContainer icon={mockIcon} href={mockHref}>
        {mockChildren}
      </ThumbnailContainer>
    );
    expect(result.container.firstChild).toHaveProperty(
      'href',
      `${BASE_WINDOW_URL}${mockHref}`
    );
  });
});
