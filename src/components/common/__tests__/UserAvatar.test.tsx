import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserAvatar } from '../UserAvatar';

const mockName = 'Andrew Chang';

describe('UserAvatar', () => {
  it('renders first letter of name', () => {
    const result = render(<UserAvatar name={mockName} />);

    expect(result.getByText(mockName[0])).toBeDefined();
  });

  it('shows tooltip of full name on hover', async () => {
    const result = render(<UserAvatar name={mockName} />);

    await userEvent.hover(result.getByText(mockName[0]));
    await waitFor(() => expect(result.getByText(mockName)).toBeDefined());
  });
});
