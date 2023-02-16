import { act, renderHook } from '@testing-library/react';
import { MouseEvent } from 'react';
import { useMenuState } from '../useMenuState';

const mockElement = <div> hello </div>;

describe('useMenuState', () => {
  it('sets menu anchor to null by default', () => {
    const { result } = renderHook(() => useMenuState());

    expect(result.current.menuAnchor).toEqual(null);
    expect(result.current.isMenuOpen).toEqual(false);
  });

  it('sets menu anchor on menu open', async () => {
    const { result } = renderHook(() => useMenuState());

    await act(() => {
      result.current.onMenuOpen({
        currentTarget: mockElement,
      } as unknown as MouseEvent<HTMLElement>);
    });

    expect(result.current.menuAnchor).toEqual(mockElement);
    expect(result.current.isMenuOpen).toEqual(true);
  });

  it('sets menu anchor to undefined on menu close', async () => {
    const { result } = renderHook(() => useMenuState());

    await act(() => {
      result.current.onMenuOpen({
        currentTarget: mockElement,
      } as unknown as MouseEvent<HTMLElement>);
    });
    expect(result.current.menuAnchor).toEqual(mockElement);
    expect(result.current.isMenuOpen).toEqual(true);

    await act(() => {
      result.current.onMenuClose();
    });
    expect(result.current.menuAnchor).toEqual(null);
    expect(result.current.isMenuOpen).toEqual(false);
  });
});
