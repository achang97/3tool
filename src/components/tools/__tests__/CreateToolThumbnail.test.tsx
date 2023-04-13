import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateToolThumbnail } from '../CreateToolThumbnail';

const mockCreateTool = jest.fn();

jest.mock('@app/redux/services/tools', () => ({
  useCreateToolMutation: jest.fn(() => [mockCreateTool, {}]),
}));

describe('CreateToolThumbnail', () => {
  const createToolDialogId = 'create-tool-dialog';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders description', () => {
    render(<CreateToolThumbnail />);

    expect(screen.getByText('New tool')).toBeTruthy();
  });

  it('opens dialog on click', async () => {
    render(<CreateToolThumbnail />);

    await userEvent.click(screen.getByText('New tool'));

    expect(await screen.findByTestId(createToolDialogId)).toBeTruthy();
  });

  it('closes dialog on blur', async () => {
    render(<CreateToolThumbnail />);

    await userEvent.click(screen.getByText('New tool'));
    expect(await screen.findByTestId(createToolDialogId)).toBeTruthy();

    await userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(screen.queryByTestId(createToolDialogId)).toBeNull();
    });
  });
});
