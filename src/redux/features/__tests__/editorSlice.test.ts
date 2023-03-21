import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import {
  Action,
  ActionType,
  ActionViewType,
  ComponentType,
  SidebarViewType,
} from '@app/types';
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
  setSidebarView,
  focusAction,
  blurAction,
  updateFocusedAction,
  setActionView,
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

    it('initially sets action view to general', () => {
      const { result } = renderHooks();
      expect(result.current.actionView).toEqual(ActionViewType.General);
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
      describe('focusAction', () => {
        it('sets focused action', async () => {
          const mockAction = {
            name: 'action1',
            type: ActionType.Javascript,
          } as Action;
          const { result, dispatch } = renderHooks();

          act(() => {
            dispatch(focusAction(mockAction));
          });
          await waitFor(() => {
            expect(result.current.focusedAction).toEqual(mockAction);
          });
        });

        it('sets action view to general', async () => {
          const mockAction = {
            name: 'action1',
            type: ActionType.Javascript,
          } as Action;
          const { result, dispatch } = renderHooks();

          act(() => {
            dispatch(setActionView(ActionViewType.ResponseHandler));
          });
          await waitFor(() => {
            expect(result.current.actionView).not.toEqual(
              ActionViewType.General
            );
          });

          act(() => {
            dispatch(focusAction(mockAction));
          });
          await waitFor(() => {
            expect(result.current.actionView).toEqual(ActionViewType.General);
          });
        });
      });

      it('blurAction: sets focused action to undefined', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(
            focusAction({
              name: 'action1',
              type: ActionType.Javascript,
            } as Action)
          );
        });
        await waitFor(() => {
          expect(result.current.focusedAction).not.toBeUndefined();
        });

        act(() => {
          dispatch(blurAction());
        });
        await waitFor(() => {
          expect(result.current.focusedAction).toBeUndefined();
        });
      });

      it('updateFocusedAction: updates focused action by merging payload', async () => {
        const { result, dispatch } = renderHooks();

        const mockAction = {
          name: 'action1',
          type: ActionType.Javascript,
          data: {},
        } as Action;

        act(() => {
          dispatch(focusAction(mockAction));
        });
        act(() => {
          dispatch(
            updateFocusedAction({ data: { javascript: { code: 'code' } } })
          );
        });
        await waitFor(() => {
          expect(result.current.focusedAction).toEqual({
            name: 'action1',
            type: ActionType.Javascript,
            data: {
              javascript: { code: 'code' },
            },
          });
        });
      });

      it('setActionView: sets action view to payload type', async () => {
        const mockActionViewType = ActionViewType.ResponseHandler;
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(setActionView(ActionViewType.ResponseHandler));
        });
        await waitFor(() => {
          expect(result.current.actionView).toEqual(mockActionViewType);
        });
      });
    });
  });
});
