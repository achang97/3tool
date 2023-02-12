import { User } from '@auth0/auth0-react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolThumbnail } from '../ToolThumbnail';

const mockId = 'mock-id';
const mockName = 'Mock Thumbnail Name';
const mockUpdatedAt = new Date().toISOString();
const mockCreator: User = { name: 'Andrew Chang' };

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
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockUpdatedAt}
        creator={mockCreator}
      />
    );

    expect(result.getByText(mockName)).toBeTruthy();
  });

  it('renders avatar for creator', () => {
    const result = render(
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockUpdatedAt}
        creator={mockCreator}
      />
    );

    expect(result.getByText(mockCreator.name![0])).toBeTruthy();
  });

  it('renders date when tool was last updated', () => {
    const mockNow = new Date(Date.UTC(2017, 1, 1));
    const mockOneMonthAgo = new Date(Date.UTC(2017, 0, 1)).toISOString();

    Date.now = jest.fn(() => mockNow.valueOf());

    const result = render(
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockOneMonthAgo}
        creator={mockCreator}
      />
    );

    expect(result.getByText('Updated a month ago')).toBeTruthy();
  });

  it('navigates to /tools/:id route on click', async () => {
    const result = render(
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockUpdatedAt}
        creator={mockCreator}
      />
    );

    await userEvent.click(result.getByText(mockName));

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/tools/${mockId}`);
  });
});
