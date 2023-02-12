import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { mockTool } from '@tests/constants/data';
import { EditorSidebar } from '../EditorSidebar';

jest.mock('../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({ tool: mockTool })),
}));

describe('EditorSidebar', () => {
  it('renders Components and Inspector tabs', () => {
    const result = render(<EditorSidebar />);

    expect(result.getByText('Components')).toBeTruthy();
    expect(result.getByText('Inspector')).toBeTruthy();
  });

  it('switches to Inspector panel on tab click', async () => {
    const result = render(<EditorSidebar />);

    await userEvent.click(result.getByText('Components'));
    await userEvent.click(result.getByText('Inspector'));

    expect(await result.findByTestId('inspector')).toBeTruthy();
  });

  it('switches to Component panel on tab click', async () => {
    const result = render(<EditorSidebar />);

    await userEvent.click(result.getByText('Inspector'));
    await userEvent.click(result.getByText('Components'));

    expect(await result.findByTestId('component-picker')).toBeTruthy();
  });
});
