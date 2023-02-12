import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';
import { CreateResourceButton } from '../CreateResourceButton';

describe('CreateResourceButton', () => {
  const createResourceDialogId = 'create-resource-dialog';

  it('renders text', () => {
    const result = render(<CreateResourceButton />);
    expect(result.getByText('Add new resource')).toBeTruthy();
  });

  it('opens dialog on click', async () => {
    const result = render(<CreateResourceButton />);

    await userEvent.click(result.getByText('Add new resource'));

    expect(await result.findByTestId(createResourceDialogId)).toBeTruthy();
  });

  it('closes dialog on blur', async () => {
    const result = render(<CreateResourceButton />);

    await userEvent.click(result.getByText('Add new resource'));
    expect(await result.findByTestId(createResourceDialogId)).toBeTruthy();

    await userEvent.keyboard('[Escape]');
    await waitFor(() => {
      expect(result.queryByTestId(createResourceDialogId)).toBeNull();
    });
  });
});
