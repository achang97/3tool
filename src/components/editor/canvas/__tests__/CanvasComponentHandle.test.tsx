import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentEvalError } from '../../hooks/useComponentEvalErrors';
import { CanvasComponentHandle } from '../CanvasComponentHandle';

const mockName = 'name';
const mockEvalError: ComponentEvalError = {
  name: 'text',
  error: new Error('Error message'),
};

describe('CanvasComponentHandle', () => {
  const errorIconId = 'canvas-component-handle-error-icon';

  it('renders name', () => {
    render(<CanvasComponentHandle name={mockName} errors={[]} />);
    expect(screen.getByText(mockName)).toBeTruthy();
  });

  it('does not render error icon if errors is empty array ', () => {
    render(<CanvasComponentHandle name={mockName} errors={[]} />);
    expect(screen.queryByTestId(errorIconId)).toBeNull();
  });

  it('renders error icon if errors is non-empty ', () => {
    render(<CanvasComponentHandle name={mockName} errors={[mockEvalError]} />);
    expect(screen.getByTestId(errorIconId)).toBeTruthy();
  });

  it('displays tooltip when hovering over error icon', async () => {
    render(<CanvasComponentHandle name={mockName} errors={[mockEvalError]} />);
    await userEvent.hover(screen.getByTestId(errorIconId));
    expect(await screen.findByText('text: Error message')).toBeTruthy();
  });
});
