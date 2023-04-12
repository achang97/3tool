import { screen, render } from '@testing-library/react';
import { User } from '@app/types';
import { mockUser } from '@tests/constants/data';
import { BASE_WINDOW_URL } from '@tests/constants/window';
import { ToolThumbnail } from '../ToolThumbnail';

const mockId = 'mock-id';
const mockName = 'Mock Thumbnail Name';
const mockUpdatedAt = new Date().toISOString();
const mockCreator: User = mockUser;

describe('ToolThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders name', () => {
    render(
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockUpdatedAt}
        creatorUser={mockCreator}
      />
    );

    expect(screen.getByText(mockName)).toBeTruthy();
  });

  it('renders avatar for creatorUser', () => {
    render(
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockUpdatedAt}
        creatorUser={mockCreator}
      />
    );

    expect(screen.getByText(mockCreator.firstName[0])).toBeTruthy();
  });

  it('renders date when tool was last updated', () => {
    const mockNow = new Date(Date.UTC(2017, 1, 1));
    const mockOneMonthAgo = new Date(Date.UTC(2017, 0, 1)).toISOString();

    Date.now = jest.fn(() => mockNow.valueOf());

    render(
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockOneMonthAgo}
        creatorUser={mockCreator}
      />
    );

    expect(screen.getByText('Updated a month ago')).toBeTruthy();
  });

  it('navigates to /tools/:id route on click', () => {
    const result = render(
      <ToolThumbnail
        id={mockId}
        name={mockName}
        updatedAt={mockUpdatedAt}
        creatorUser={mockCreator}
      />
    );

    expect(result.container.firstChild).toHaveProperty(
      'href',
      `${BASE_WINDOW_URL}/tools/${mockId}`
    );
  });
});
