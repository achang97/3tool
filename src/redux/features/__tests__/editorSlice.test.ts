import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { ComponentType, SidebarViewType } from '@app/types';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import {
  startCreateComponentDrag,
  endCreateComponentDrag,
  startMoveComponentDrag,
  endMoveComponentDrag,
  focusComponent,
  blurComponent,
  focusToolSettings,
  setSnackbarMessage,
  setSidebarView,
  SnackbarMessage,
  focusAction,
  blurAction,
} from '../editorSlice';

describe('editorSlice', () => {
  const renderHooks = () => {
    const { result } = renderHook(() =>
      useAppSelector((state) => state.editor)
    );
    const {
      result: { current: dispatch },
    } = renderHook(() => useAppDispatch());

    return { result, dispatch };
  };

  describe('initialState', () => {
    it('initially sets sidebar view to components', () => {
      const { result } = renderHooks();
      expect(result.current.sidebarView).toEqual(SidebarViewType.Components);
    });
  });

  describe('actions', () => {
    describe('create component', () => {
      it('startCreateComponentDrag: sets new component object', async () => {
        const { result, dispatch } = renderHooks();

        const mockComponent = { name: 'name', type: ComponentType.Button };
        act(() => {
          dispatch(startCreateComponentDrag(mockComponent));
        });
        await waitFor(() => {
          expect(result.current.newComponent).toEqual(mockComponent);
        });
      });

      it('endCreateComponentDrag: unsets new component', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(
            startCreateComponentDrag({
              name: 'name',
              type: ComponentType.Button,
            })
          );
        });
        await waitFor(() => {
          expect(result.current.newComponent).toBeTruthy();
        });

        act(() => {
          dispatch(endCreateComponentDrag());
        });
        await waitFor(() => {
          expect(result.current.newComponent).toBeUndefined();
        });
      });
    });

    describe('move', () => {
      it('startMoveComponentDrag: sets moving component name', async () => {
        const { result, dispatch } = renderHooks();

        const mockComponentName = 'name';
        act(() => {
          dispatch(startMoveComponentDrag(mockComponentName));
        });
        await waitFor(() => {
          expect(result.current.movingComponentName).toEqual(mockComponentName);
        });
      });

      it('endMoveComponentDrag: unsets moving component name', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(startMoveComponentDrag('name'));
        });
        await waitFor(() => {
          expect(result.current.movingComponentName).toBeTruthy();
        });

        act(() => {
          dispatch(endMoveComponentDrag());
        });
        await waitFor(() => {
          expect(result.current.movingComponentName).toBeUndefined();
        });
      });
    });

    describe('sidebar focus', () => {
      it('focusComponent: sets focused component name and changes sidebar view to Inspector', async () => {
        const { result, dispatch } = renderHooks();

        const mockComponentName = 'name';
        act(() => {
          dispatch(focusComponent(mockComponentName));
        });
        await waitFor(() => {
          expect(result.current.focusedComponentName).toEqual(
            mockComponentName
          );
          expect(result.current.sidebarView).toEqual(SidebarViewType.Inspector);
        });
      });

      it('blurComponent: unsets focused component name and changes sidebar view to Components', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(blurComponent());
        });
        await waitFor(() => {
          expect(result.current.focusedComponentName).toBeUndefined();
          expect(result.current.sidebarView).toEqual(
            SidebarViewType.Components
          );
        });
      });

      it('focusToolSettings: unsets focused component name and changes sidebar view to Inspector', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(focusToolSettings());
        });
        await waitFor(() => {
          expect(result.current.focusedComponentName).toBeUndefined();
          expect(result.current.sidebarView).toEqual(SidebarViewType.Inspector);
        });
      });

      it.each([SidebarViewType.Components, SidebarViewType.Inspector])(
        'setSidebarView: sets sidebar view to %s',
        async (sidebarView: SidebarViewType) => {
          const { result, dispatch } = renderHooks();

          act(() => {
            dispatch(setSidebarView(sidebarView));
          });
          await waitFor(() => {
            expect(result.current.sidebarView).toEqual(sidebarView);
          });
        }
      );
    });

    describe('actions', () => {
      it('focusAction: sets focused action name', async () => {
        const mockActionName = 'action';
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(focusAction(mockActionName));
        });
        await waitFor(() => {
          expect(result.current.focusedActionName).toEqual(mockActionName);
        });
      });

      it('blurAction: sets focused action name to undefined', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(focusAction('action'));
        });
        await waitFor(() => {
          expect(result.current.focusedActionName).not.toBeUndefined();
        });

        act(() => {
          dispatch(blurAction());
        });
        await waitFor(() => {
          expect(result.current.focusedActionName).toBeUndefined();
        });
      });
    });

    describe('alerts', () => {
      it('setSnackbarMessage: sets snackbar message object to given value', async () => {
        const { result, dispatch } = renderHooks();

        const snackbarMessage: SnackbarMessage = {
          type: 'success',
          message: 'Hello',
        };
        act(() => {
          dispatch(setSnackbarMessage(snackbarMessage));
        });
        await waitFor(() => {
          expect(result.current.snackbarMessage).toEqual(snackbarMessage);
        });

        act(() => {
          dispatch(setSnackbarMessage(undefined));
        });
        await waitFor(() => {
          expect(result.current.snackbarMessage).toBeUndefined();
        });
      });
    });
  });
});
