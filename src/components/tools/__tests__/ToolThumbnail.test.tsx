import { screen, render } from '@testing-library/react';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { ToolThumbnail } from '../ToolThumbnail';

const mockId = 'mock-id';
const mockName = 'Mock Thumbnail Name';
const mockUpdatedAt = new Date().toISOString();

describe('ToolThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders name', () => {
    render(<ToolThumbnail id={mockId} name={mockName} updatedAt={mockUpdatedAt} />);

    expect(screen.getByText(mockName)).toBeTruthy();
  });

  it('renders date when tool was last updated', () => {
    const mockNow = new Date(Date.UTC(2017, 1, 1));
    const mockOneMonthAgo = new Date(Date.UTC(2017, 0, 1)).toISOString();

    Date.now = jest.fn(() => mockNow.valueOf());

    render(<ToolThumbnail id={mockId} name={mockName} updatedAt={mockOneMonthAgo} />);

    expect(screen.getByText('Updated a month ago')).toBeTruthy();
  });

  it('navigates to /apps/:id route on click', () => {
    render(<ToolThumbnail id={mockId} name={mockName} updatedAt={mockUpdatedAt} />);
    expect(screen.getByTestId('thumbnail-container-content')).toHaveProperty(
      'href',
      `${BASE_WINDOW_URL}/apps/${mockId}/${encodeURIComponent(mockName)}`
    );
  });
});
