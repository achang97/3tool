import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateResourceButton } from '../CreateResourceButton';

describe('CreateResourceButton', () => {
  const createResourceDialogId = 'create-resource-dialog';

  it('renders text', () => {
    const result = render(<CreateResourceButton />);
    expect(result.getByText('Add new resource')).toBeDefined();
  });

  it('opens dialog on click', async () => {
    const result = render(<CreateResourceButton />);

    userEvent.click(result.getByText('Add new resource'));

    expect(result.findByTestId(createResourceDialogId)).toBeDefined();
  });

  it('closes dialog on blur', async () => {
    const result = render(<CreateResourceButton />);

    userEvent.click(result.getByText('Add new resource'));
    expect(result.findByTestId(createResourceDialogId)).toBeDefined();

    userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(result.queryByTestId(createResourceDialogId)).toBeNull();
    });
  });
});
