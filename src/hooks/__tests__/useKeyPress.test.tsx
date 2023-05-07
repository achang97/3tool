import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useKeyPress } from '../useKeyPress';

const mockHandlePress = jest.fn();

describe('useKeyPress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not call onPress if key does not match', async () => {
    renderHook(() => useKeyPress({ key: 'a', cmdKey: false, onPress: mockHandlePress }));
    await userEvent.keyboard('s');
    expect(mockHandlePress).not.toHaveBeenCalled();
  });

  it('does not call onPress if command key is required and not pressed', async () => {
    renderHook(() => useKeyPress({ key: 'a', cmdKey: true, onPress: mockHandlePress }));
    await userEvent.keyboard('a');
    expect(mockHandlePress).not.toHaveBeenCalled();
  });

  it('does not call onPress if command key is not required and pressed', async () => {
    renderHook(() => useKeyPress({ key: 'a', cmdKey: false, onPress: mockHandlePress }));
    await userEvent.keyboard('{Meta>}a');
    expect(mockHandlePress).not.toHaveBeenCalled();
  });

  it('does not call onPress if event target is not within selector', async () => {
    renderHook(() => useKeyPress({ key: 'a', selector: '#invalid', onPress: mockHandlePress }));
    await userEvent.keyboard('a');
    expect(mockHandlePress).not.toHaveBeenCalled();
  });

  it('does not call onPress if input events are ignored and key press originates from input', async () => {
    const Component = () => {
      useKeyPress({ key: 'a', ignoreInputEvents: true, onPress: mockHandlePress });
      return <input />;
    };
    render(<Component />);
    await userEvent.type(screen.getByRole('textbox'), 'a');
    expect(mockHandlePress).not.toHaveBeenCalled();
  });

  it('calls onPress if event target is within selector', async () => {
    const Component = () => {
      useKeyPress({ key: 'a', selector: '#container', onPress: mockHandlePress });
      return (
        <div id="container">
          <input />
        </div>
      );
    };
    render(<Component />);
    await userEvent.type(screen.getByRole('textbox'), 'a');
    expect(mockHandlePress).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  it('calls onPress if input events are ignored and key press does not originate from input', async () => {
    renderHook(() => useKeyPress({ key: 'a', ignoreInputEvents: true, onPress: mockHandlePress }));
    await userEvent.keyboard('a');
    expect(mockHandlePress).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  it('calls onPress if key matches and meta is pressed', async () => {
    renderHook(() => useKeyPress({ key: 'a', cmdKey: true, onPress: mockHandlePress }));
    await userEvent.keyboard('{Meta>}a');
    expect(mockHandlePress).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  it('calls onPress if key matches and ctrl is pressed', async () => {
    renderHook(() => useKeyPress({ key: 'a', cmdKey: true, onPress: mockHandlePress }));
    await userEvent.keyboard('{Control>}a');
    expect(mockHandlePress).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });
});
