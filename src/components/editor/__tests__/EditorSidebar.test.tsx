import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { EditorSidebar } from '../EditorSidebar';

describe('EditorSidebar', () => {
  it('renders Components and Inspector tabs', () => {
    const result = render(<EditorSidebar />);

    expect(result.getByText('Components')).toBeDefined();
    expect(result.getByText('Inspector')).toBeDefined();
  });

  it('switches to Inspector panel on tab click', async () => {
    const result = render(<EditorSidebar />);

    userEvent.click(result.getByText('Components'));
    userEvent.click(result.getByText('Inspector'));

    expect(await result.findByTestId('editor-inspector')).toBeDefined();
  });

  it('switches to Component panel on tab click', async () => {
    const result = render(<EditorSidebar />);

    userEvent.click(result.getByText('Inspector'));
    userEvent.click(result.getByText('Components'));

    expect(await result.findByTestId('editor-component-picker')).toBeDefined();
  });
});
