import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { waitFor, act } from '@testing-library/react';
import { mockSmartContractResource } from '@tests/constants/data';
import { renderHook } from '@tests/utils/renderWithContext';
import { setActiveResource } from '../resourcesSlice';

describe('resourcesSlice', () => {
  const renderHooks = () => {
    const { result } = renderHook(() =>
      useAppSelector((state) => state.resources)
    );
    const {
      result: { current: dispatch },
    } = renderHook(() => useAppDispatch());

    return { result, dispatch };
  };

  describe('initialState', () => {
    it('initially sets activeResource to undefined', () => {
      const { result } = renderHooks();
      expect(result.current.activeResource).toBeUndefined();
    });
  });

  describe('actions', () => {
    it('setActiveResource: sets activeResource to given value', async () => {
      const { result, dispatch } = renderHooks();

      act(() => {
        dispatch(setActiveResource(mockSmartContractResource));
      });
      await waitFor(() => {
        expect(result.current.activeResource).toEqual(
          mockSmartContractResource
        );
      });

      act(() => {
        dispatch(setActiveResource(undefined));
      });
      await waitFor(() => {
        expect(result.current.activeResource).toBeUndefined();
      });
    });
  });
});
