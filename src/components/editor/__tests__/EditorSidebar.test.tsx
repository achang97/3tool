import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import userEvent from '@testing-library/user-event';
import { mockTool } from '@tests/constants/data';
import { EditorSidebar } from '../EditorSidebar';

jest.mock('../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({ tool: mockTool })),
}));

describe('EditorSidebar', () => {
  it('renders Components and Inspector tabs', () => {
    render(<EditorSidebar />);

    expect(screen.getByText('Components')).toBeTruthy();
    expect(screen.getByText('Inspector')).toBeTruthy();
  });

  it('switches to Inspector panel on tab click', async () => {
    render(<EditorSidebar />);

    await userEvent.click(screen.getByText('Components'));
    await userEvent.click(screen.getByText('Inspector'));

    expect(await screen.findByTestId('inspector')).toBeTruthy();
  });

  it('switches to Component panel on tab click', async () => {
    render(<EditorSidebar />);

    await userEvent.click(screen.getByText('Inspector'));
    await userEvent.click(screen.getByText('Components'));

    expect(await screen.findByTestId('component-picker')).toBeTruthy();
  });
});
