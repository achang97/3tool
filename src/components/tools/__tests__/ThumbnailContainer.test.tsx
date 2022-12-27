import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThumbnailContainer } from '../ThumbnailContainer';

const mockChildren = 'children';
const mockHandleClick = jest.fn();

describe('ThumbnailContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const result = render(
      <ThumbnailContainer onClick={mockHandleClick}>
        {mockChildren}
      </ThumbnailContainer>
    );

    expect(result.getByText(mockChildren)).toBeDefined();
  });

  it('calls onClick when container is clicked', async () => {
    const result = render(
      <ThumbnailContainer onClick={mockHandleClick}>
        {mockChildren}
      </ThumbnailContainer>
    );

    userEvent.click(result.getByText(mockChildren));
    await waitFor(() => expect(mockHandleClick).toHaveBeenCalledTimes(1));
  });
});
