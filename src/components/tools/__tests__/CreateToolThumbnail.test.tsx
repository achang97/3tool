import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateToolThumbnail } from '../CreateToolThumbnail';

const mockPush = jest.fn();
const mockCreateTool = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock('@app/redux/services/tools', () => ({
  useCreateToolMutation: jest.fn(() => [mockCreateTool, {}]),
}));

describe('CreateToolThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders description', () => {
    const result = render(<CreateToolThumbnail />);

    expect(result.getByText('New tool')).toBeDefined();
  });

  it('opens dialog on click', async () => {
    const result = render(<CreateToolThumbnail />);

    userEvent.click(result.getByText('New tool'));
    await waitFor(() => {
      expect(result.getByText('Create new tool')).toBeDefined();
    });
  });

  it('closes dialog when clicking outside of dialog', async () => {
    const result = render(
      <>
        <CreateToolThumbnail />
        <div>Close dialog</div>
      </>
    );

    userEvent.click(result.getByText('New tool'));
    await waitFor(() => {
      expect(result.getByText('Create new tool')).toBeDefined();
    });

    userEvent.click(result.getByText('Close dialog'));
    await waitFor(() => {
      expect(result.queryByTestId('Create new tool')).toBeNull();
    });
  });
});
