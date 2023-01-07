import { renderHook } from '@testing-library/react';
import { usePrevious } from '../usePrevious';

describe('usePrevious', () => {
  it('returns undefined by default', () => {
    const { result } = renderHook(usePrevious);
    expect(result.current).toBeUndefined();
  });

  it('returns previous value by default', () => {
    const { result, rerender } = renderHook(() => usePrevious(1));

    rerender(2);
    expect(result.current).toEqual(1);
  });
});
