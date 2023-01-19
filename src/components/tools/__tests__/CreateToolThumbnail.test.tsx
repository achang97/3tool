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
  const createToolDialogId = 'create-tool-dialog';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders description', () => {
    const result = render(<CreateToolThumbnail />);

    expect(result.getByText('New tool')).toBeDefined();
  });

  it('opens dialog on click', async () => {
    const result = render(<CreateToolThumbnail />);

    await userEvent.click(result.getByText('New tool'));

    expect(await result.findByTestId(createToolDialogId)).toBeDefined();
  });

  it('closes dialog on blur', async () => {
    const result = render(<CreateToolThumbnail />);

    await userEvent.click(result.getByText('New tool'));
    expect(await result.findByTestId(createToolDialogId)).toBeDefined();

    await userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(result.queryByTestId(createToolDialogId)).toBeNull();
    });
  });
});
