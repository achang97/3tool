import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { EditorSidebar } from '../EditorSidebar';

jest.mock('../hooks/useGetActiveTool', () => ({
  useGetActiveTool: jest.fn(() => undefined),
}));

describe('EditorSidebar', () => {
  it('renders Components and Inspector tabs', () => {
    const result = render(<EditorSidebar />);

    expect(result.getByText('Components')).toBeDefined();
    expect(result.getByText('Inspector')).toBeDefined();
  });

  it('switches to Inspector panel on tab click', async () => {
    const result = render(<EditorSidebar />);

    await userEvent.click(result.getByText('Components'));
    await userEvent.click(result.getByText('Inspector'));

    expect(await result.findByTestId('inspector')).toBeDefined();
  });

  it('switches to Component panel on tab click', async () => {
    const result = render(<EditorSidebar />);

    await userEvent.click(result.getByText('Inspector'));
    await userEvent.click(result.getByText('Components'));

    expect(await result.findByTestId('component-picker')).toBeDefined();
  });
});
