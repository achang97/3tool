import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  renameActionResult,
  renameComponentInput,
  resetActionResult,
  resetComponentInput,
  setActionResult,
  setComponentInput,
} from '../activeToolSlice';

describe('activeToolSlice', () => {
  const renderHooks = () => {
    const { result } = renderHook(() =>
      useAppSelector((state) => state.activeTool)
    );
    const {
      result: { current: dispatch },
    } = renderHook(() => useAppDispatch());

    return { result, dispatch };
  };

  describe('initialState', () => {
    it('initially sets componentInputs to empty object', () => {
      const { result } = renderHooks();
      expect(result.current.componentInputs).toEqual({});
    });
  });

  describe('actions', () => {
    describe('component inputs', () => {
      it('setComponentInput: sets input value for given component name', async () => {
        const { result, dispatch } = renderHooks();

        const mockName = 'name';
        const mockInput = { value: '1' };

        act(() => {
          dispatch(setComponentInput({ name: mockName, input: mockInput }));
        });
        await waitFor(() => {
          expect(result.current.componentInputs[mockName]).toEqual(mockInput);
        });
      });

      it('resetComponentInput: sets input value for given component name back to undefined', async () => {
        const { result, dispatch } = renderHooks();

        const mockName = 'name';

        act(() => {
          dispatch(
            setComponentInput({ name: mockName, input: { value: '1' } })
          );
        });
        await waitFor(() => {
          expect(result.current.componentInputs).not.toBeUndefined();
        });

        act(() => {
          dispatch(resetComponentInput(mockName));
        });
        await waitFor(() => {
          expect(result.current.componentInputs[mockName]).toBeUndefined();
        });
      });

      it('renameComponentInput: moves input value from previous name to new name', async () => {
        const { result, dispatch } = renderHooks();

        const mockPrevName = 'name';
        const mockNewName = 'new-name';
        const mockInput = { value: '1' };

        act(() => {
          dispatch(setComponentInput({ name: mockPrevName, input: mockInput }));
        });
        await waitFor(() => {
          expect(result.current.componentInputs[mockPrevName]).toEqual(
            mockInput
          );
          expect(result.current.componentInputs[mockNewName]).toBeUndefined();
        });

        act(() => {
          dispatch(
            renameComponentInput({
              prevName: mockPrevName,
              newName: mockNewName,
            })
          );
        });
        await waitFor(() => {
          expect(result.current.componentInputs[mockPrevName]).toBeUndefined();
          expect(result.current.componentInputs[mockNewName]).toEqual(
            mockInput
          );
        });
      });
    });

    describe('action results', () => {
      it('setActionResult: sets result value for given action name', async () => {
        const { result, dispatch } = renderHooks();

        const mockName = 'name';
        const mockResult = { data: 'data' };

        act(() => {
          dispatch(setActionResult({ name: mockName, result: mockResult }));
        });
        await waitFor(() => {
          expect(result.current.actionResults[mockName]).toEqual(mockResult);
        });
      });

      it('resetActionResult: sets result value for given action name back to undefined', async () => {
        const { result, dispatch } = renderHooks();

        const mockName = 'name';

        act(() => {
          dispatch(
            setActionResult({ name: mockName, result: { data: 'data' } })
          );
        });
        await waitFor(() => {
          expect(result.current.actionResults).not.toBeUndefined();
        });

        act(() => {
          dispatch(resetActionResult(mockName));
        });
        await waitFor(() => {
          expect(result.current.actionResults[mockName]).toBeUndefined();
        });
      });

      it('renameActionResult: moves result value from previous name to new name', async () => {
        const { result, dispatch } = renderHooks();

        const mockPrevName = 'name';
        const mockNewName = 'new-name';
        const mockResult = { data: 'data' };

        act(() => {
          dispatch(setActionResult({ name: mockPrevName, result: mockResult }));
        });
        await waitFor(() => {
          expect(result.current.actionResults[mockPrevName]).toEqual(
            mockResult
          );
          expect(result.current.actionResults[mockNewName]).toBeUndefined();
        });

        act(() => {
          dispatch(
            renameActionResult({
              prevName: mockPrevName,
              newName: mockNewName,
            })
          );
        });
        await waitFor(() => {
          expect(result.current.actionResults[mockPrevName]).toBeUndefined();
          expect(result.current.actionResults[mockNewName]).toEqual(mockResult);
        });
      });
    });
  });
});
