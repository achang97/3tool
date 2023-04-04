import {
  Action,
  ActionEvent,
  ActionType,
  ActionViewType,
  ComponentType,
  SidebarViewType,
} from '@app/types';
import editorReducer, {
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
  setIsActionViewMaximized,
  setIsPreview,
} from '../editorSlice';

describe('editorSlice', () => {
  describe('create component', () => {
    it('startCreateComponentDrag: sets new component object', () => {
      const mockComponent = { name: 'name', type: ComponentType.Button };

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
      };
      const state = editorReducer(
        initialState,
        startCreateComponentDrag(mockComponent)
      );
      expect(state.newComponent).toEqual(mockComponent);
    });

    it('endCreateComponentDrag: unsets new component', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
        newComponent: {
          name: 'name',
          type: ComponentType.Button,
        },
      };
      const state = editorReducer(initialState, endCreateComponentDrag());
      expect(state.newComponent).toBeUndefined();
    });
  });

  describe('move', () => {
    it('startMoveComponentDrag: sets moving component name', () => {
      const mockComponentName = 'name';

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
      };
      const state = editorReducer(
        initialState,
        startMoveComponentDrag(mockComponentName)
      );
      expect(state.movingComponentName).toEqual(mockComponentName);
    });

    it('endMoveComponentDrag: unsets moving component name', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
        movingComponentName: 'name',
      };
      const state = editorReducer(initialState, endMoveComponentDrag());
      expect(state.movingComponentName).toBeUndefined();
    });
  });

  describe('sidebar focus', () => {
    it('focusComponent: sets focused component name and changes sidebar view to Inspector', () => {
      const mockComponentName = 'name';

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
      };
      const state = editorReducer(
        initialState,
        focusComponent(mockComponentName)
      );
      expect(state.focusedComponentName).toEqual(mockComponentName);
      expect(state.sidebarView).toEqual(SidebarViewType.Inspector);
    });

    it('blurComponent: unsets focused component name and changes sidebar view to Components', () => {
      const initialState = {
        sidebarView: SidebarViewType.Inspector,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
        focusedComponentName: 'name',
      };
      const state = editorReducer(initialState, blurComponent());
      expect(state.focusedComponentName).toBeUndefined();
      expect(state.sidebarView).toEqual(SidebarViewType.Components);
    });

    it('focusToolSettings: unsets focused component name and changes sidebar view to Inspector', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
        focusedComponentName: 'name',
      };
      const state = editorReducer(initialState, focusToolSettings());
      expect(state.focusedComponentName).toBeUndefined();
      expect(state.sidebarView).toEqual(SidebarViewType.Inspector);
    });

    it.each([SidebarViewType.Components, SidebarViewType.Inspector])(
      'setSidebarView: sets sidebar view to %s',
      (sidebarView: SidebarViewType) => {
        const initialState = {
          sidebarView: SidebarViewType.Components,
          actionView: ActionViewType.General,
          isActionViewMaximized: false,
          isPreview: false,
          focusedComponentName: 'name',
        };
        const state = editorReducer(initialState, setSidebarView(sidebarView));
        expect(state.sidebarView).toEqual(sidebarView);
      }
    );
  });

  describe('actions', () => {
    it('focusAction: sets action view to general and focused action', () => {
      const mockAction = {
        name: 'action1',
        type: ActionType.Javascript,
      } as Action;

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.ResponseHandler,
        isActionViewMaximized: false,
        isPreview: false,
      };
      const state = editorReducer(initialState, focusAction(mockAction));
      expect(state.focusedAction).toEqual(mockAction);
      expect(state.actionView).toEqual(ActionViewType.General);
    });

    it('blurAction: sets focused action to undefined', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.ResponseHandler,
        isActionViewMaximized: false,
        isPreview: false,
        focusedAction: {
          name: 'action1',
          type: ActionType.Javascript,
        } as Action,
      };
      const state = editorReducer(initialState, blurAction());
      expect(state.focusedAction).toBeUndefined();
    });

    describe('updateFocusedAction', () => {
      it('updates focused action by merging payload', () => {
        const initialState = {
          sidebarView: SidebarViewType.Components,
          actionView: ActionViewType.General,
          isActionViewMaximized: false,
          isPreview: false,
          focusedAction: {
            name: 'action1',
            type: ActionType.Javascript,
            data: {},
          } as Action,
        };
        const state = editorReducer(
          initialState,
          updateFocusedAction({ data: { javascript: { code: 'code' } } })
        );
        expect(state.focusedAction).toEqual({
          name: 'action1',
          type: ActionType.Javascript,
          data: {
            javascript: { code: 'code' },
          },
        });
      });

      it('overwrites arrays with payload', () => {
        const initialState = {
          sidebarView: SidebarViewType.Components,
          actionView: ActionViewType.General,
          isActionViewMaximized: false,
          isPreview: false,
          focusedAction: {
            name: 'action1',
            type: ActionType.Javascript,
            data: {},
            eventHandlers: [{ event: ActionEvent.Success }],
          } as Action,
        };
        const state = editorReducer(
          initialState,
          updateFocusedAction({ eventHandlers: [] })
        );
        expect(state.focusedAction).toEqual({
          name: 'action1',
          type: ActionType.Javascript,
          data: {},
          eventHandlers: [],
        });
      });
    });

    it('setActionView: sets action view to payload type', () => {
      const mockActionViewType = ActionViewType.ResponseHandler;

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
      };
      const state = editorReducer(
        initialState,
        setActionView(ActionViewType.ResponseHandler)
      );
      expect(state.actionView).toEqual(mockActionViewType);
    });

    it('setIsActionViewMaximized: sets action view maximized boolean to payload', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
      };
      const state = editorReducer(initialState, setIsActionViewMaximized(true));
      expect(state.isActionViewMaximized).toEqual(true);
    });
  });

  describe('general', () => {
    it('setIsPreview: sets preview boolean to payload', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        isActionViewMaximized: false,
        isPreview: false,
      };
      const state = editorReducer(initialState, setIsPreview(true));
      expect(state.isPreview).toEqual(true);
    });
  });
});
