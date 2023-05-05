import { renderHook } from '@testing-library/react';
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

  it('calls onPress if key matches and meta is pressed', async () => {
    renderHook(() => useKeyPress({ key: 'a', cmdKey: true, onPress: mockHandlePress }));
    await userEvent.keyboard('{Meta>}a');
    expect(mockHandlePress).toHaveBeenCalled();
  });

  it('calls onPress if key matches and ctrl is pressed', async () => {
    renderHook(() => useKeyPress({ key: 'a', cmdKey: true, onPress: mockHandlePress }));
    await userEvent.keyboard('{Control>}a');
    expect(mockHandlePress).toHaveBeenCalled();
  });
});
