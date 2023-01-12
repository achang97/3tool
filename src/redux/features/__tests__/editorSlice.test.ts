import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { ComponentType, SidebarViewType } from '@app/types';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import { Layout } from 'react-grid-layout';
import {
  blurComponentFocus,
  createComponent,
  deleteComponent,
  endCreateComponentDrag,
  endMoveComponentDrag,
  focusComponent,
  focusToolSettings,
  setSidebarView,
  startCreateComponentDrag,
  startMoveComponentDrag,
  updateLayout,
} from '../editorSlice';

describe('resourcesSlice', () => {
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
    it('initially sets layout to empty array', () => {
      const { result } = renderHooks();
      expect(result.current.layout).toEqual([]);
    });

    it('initially sets components to empty object', () => {
      const { result } = renderHooks();
      expect(result.current.components).toEqual({});
    });

    it('initially sets sidebar view to components', () => {
      const { result } = renderHooks();
      expect(result.current.sidebarView).toEqual(SidebarViewType.Components);
    });
  });

  describe('actions', () => {
    describe('create component', () => {
      it('startCreateComponentDrag: sets new component object', async () => {
        const { result, dispatch } = renderHooks();

        const mockComponentType = ComponentType.Button;
        act(() => {
          dispatch(startCreateComponentDrag(mockComponentType));
        });
        await waitFor(() => {
          expect(result.current.newComponent).toEqual({
            id: `${mockComponentType}1`,
            type: mockComponentType,
          });
        });
      });

      it('endCreateComponentDrag: unsets new component', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(startCreateComponentDrag(ComponentType.Button));
        });
        await waitFor(() => {
          expect(result.current.newComponent).toBeDefined();
        });

        act(() => {
          dispatch(endCreateComponentDrag());
        });
        await waitFor(() => {
          expect(result.current.newComponent).toBeUndefined();
        });
      });

      it('createComponent: adds new entry to components object', async () => {
        const { result, dispatch } = renderHooks();

        const mockNewComponent = { id: 'button1', type: ComponentType.Button };
        act(() => {
          dispatch(createComponent(mockNewComponent));
        });
        await waitFor(() => {
          expect(result.current.components[mockNewComponent.id]).toEqual(
            mockNewComponent.type
          );
        });
      });
    });

    describe('move', () => {
      it('startMoveComponentDrag: sets moving component id', async () => {
        const { result, dispatch } = renderHooks();

        const mockComponentId = 'id';
        act(() => {
          dispatch(startMoveComponentDrag(mockComponentId));
        });
        await waitFor(() => {
          expect(result.current.movingComponentId).toEqual(mockComponentId);
        });
      });

      it('endMoveComponentDrag: unsets moving component id', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(startMoveComponentDrag('id'));
        });
        await waitFor(() => {
          expect(result.current.movingComponentId).toBeDefined();
        });

        act(() => {
          dispatch(endMoveComponentDrag());
        });
        await waitFor(() => {
          expect(result.current.movingComponentId).toBeUndefined();
        });
      });
    });

    describe('delete', () => {
      it('deleteComponent: deletes component with given id', async () => {
        const { result, dispatch } = renderHooks();

        const mockNewComponent = { id: 'button1', type: ComponentType.Button };
        act(() => {
          dispatch(createComponent(mockNewComponent));
        });
        await waitFor(() => {
          expect(result.current.components[mockNewComponent.id]).toBeDefined();
        });

        act(() => {
          dispatch(deleteComponent(mockNewComponent.id));
        });
        await waitFor(() => {
          expect(
            result.current.components[mockNewComponent.id]
          ).toBeUndefined();
        });
      });
    });

    describe('sidebar focus', () => {
      it('focusComponent: sets focused component id and changes sidebar view to Inspector', async () => {
        const { result, dispatch } = renderHooks();

        const mockComponentId = 'id';
        act(() => {
          dispatch(focusComponent(mockComponentId));
        });
        await waitFor(() => {
          expect(result.current.focusedComponentId).toEqual(mockComponentId);
          expect(result.current.sidebarView).toEqual(SidebarViewType.Inspector);
        });
      });

      it('blurComponentFocus: unsets focused component id and changes sidebar view to Components', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(blurComponentFocus());
        });
        await waitFor(() => {
          expect(result.current.focusedComponentId).toBeUndefined();
          expect(result.current.sidebarView).toEqual(
            SidebarViewType.Components
          );
        });
      });

      it('focusToolSettings: unsets focused component id and changes sidebar view to Inspector', async () => {
        const { result, dispatch } = renderHooks();

        act(() => {
          dispatch(focusToolSettings());
        });
        await waitFor(() => {
          expect(result.current.focusedComponentId).toBeUndefined();
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

    describe('layout', () => {
      it('updateLayout: sets layout', async () => {
        const { result, dispatch } = renderHooks();

        const mockLayout: Layout[] = [
          {
            i: '1',
            x: 1,
            y: 1,
            w: 1,
            h: 1,
          },
        ];
        act(() => {
          dispatch(updateLayout(mockLayout));
        });
        await waitFor(() => {
          expect(result.current.layout).toEqual(mockLayout);
        });
      });
    });
  });
});
