import { act, renderHook } from '@testing-library/react';
import { useIsFocused } from '../useIsFocused';

describe('useIsFocused', () => {
  it('isFocused: is false by default', () => {
    const { result } = renderHook(() => useIsFocused());
    expect(result.current.isFocused).toEqual(false);
  });

  it('onFocus: sets isFocused to true', async () => {
    const { result } = renderHook(() => useIsFocused());

    expect(result.current.isFocused).toEqual(false);

    await act(() => {
      result.current.onFocus();
    });
    expect(result.current.isFocused).toEqual(true);
  });

  it('onBlur: sets isFocused to false', async () => {
    const { result } = renderHook(() => useIsFocused());

    await act(() => {
      result.current.onFocus();
    });
    expect(result.current.isFocused).toEqual(true);

    await act(() => {
      result.current.onBlur();
    });
    expect(result.current.isFocused).toEqual(false);
  });
});
