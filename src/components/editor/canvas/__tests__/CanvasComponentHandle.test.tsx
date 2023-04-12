import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentEvalError } from '../../hooks/useComponentEvalErrors';
import { CanvasComponentHandle, CANVAS_COMPONENT_HANDLE_CLASSNAME } from '../CanvasComponentHandle';

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

  it('passes "canvas-component-handle" class name', () => {
    const result = render(<CanvasComponentHandle name={mockName} errors={[mockEvalError]} />);
    expect(result.container.firstChild).toHaveClass(CANVAS_COMPONENT_HANDLE_CLASSNAME);
  });
});
