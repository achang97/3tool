import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolThumbnail } from '../ToolThumbnail';

const mockId = 'mock-id';
const mockName = 'Mock Thumbnail Name';
const mockUpdatedAt = new Date();

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe('ToolThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders name', () => {
    const result = render(
      <ToolThumbnail id={mockId} name={mockName} updatedAt={mockUpdatedAt} />
    );

    expect(result.getByText(mockName)).toBeDefined();
  });

  it('renders date when tool was last updated', () => {
    const mockNow = new Date(Date.UTC(2017, 1, 1));
    const mockOneMonthAgo = new Date(Date.UTC(2017, 0, 1));

    Date.now = jest.fn(() => mockNow.valueOf());

    const result = render(
      <ToolThumbnail id={mockId} name={mockName} updatedAt={mockOneMonthAgo} />
    );

    expect(result.getByText('Edited a month ago')).toBeDefined();
  });

  it('navigates to /tools/:id route on click', async () => {
    const result = render(
      <ToolThumbnail id={mockId} name={mockName} updatedAt={mockUpdatedAt} />
    );

    userEvent.click(result.getByText(mockName));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(`/tools/${mockId}`);
    });
  });
});
