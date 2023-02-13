import { act, renderHook } from '@testing-library/react';
import { useIsHovered } from '../useIsHovered';

describe('useIsHovered', () => {
  it('isHovered: is false by default', () => {
    const { result } = renderHook(() => useIsHovered());
    expect(result.current.isHovered).toEqual(false);
  });

  it('onMouseEnter: sets isHovered to true ', async () => {
    const { result } = renderHook(() => useIsHovered());

    expect(result.current.isHovered).toEqual(false);

    await act(() => {
      result.current.onMouseEnter();
    });
    expect(result.current.isHovered).toEqual(true);
  });

  it('onMouseLeave: sets isHovered to false ', async () => {
    const { result } = renderHook(() => useIsHovered());

    await act(() => {
      result.current.onMouseEnter();
    });
    expect(result.current.isHovered).toEqual(true);

    await act(() => {
      result.current.onMouseLeave();
    });
    expect(result.current.isHovered).toEqual(false);
  });
});
