import Editor from '@app/pages/editor/[id]';
import userEvent from '@testing-library/user-event';
import { render } from '@tests/utils/renderWithContext';

describe('Editor/Id', () => {
  it('renders editor sidebar', async () => {
    const result = render(<Editor />);

    // Default view should be the component picker
    expect(await result.findByTestId('editor-component-picker')).toBeDefined();

    userEvent.click(result.getByText('Inspector'));
    expect(await result.findByTestId('editor-inspector')).toBeDefined();

    userEvent.click(result.getByText('Components'));
    expect(await result.findByTestId('editor-component-picker')).toBeDefined();
  });
});
