import {
  Action,
  ActionEvent,
  ActionType,
  ActionViewType,
  ComponentType,
  SidebarViewType,
} from '@app/types';
import { ACTION_VIEW_MIN_HEIGHT } from '@app/constants';
import editorReducer, {
  startCreateComponentDrag,
  stopCreateComponentDrag,
  startMoveComponentDrag,
  stopMoveComponentDrag,
  focusComponent,
  blurComponent,
  focusToolSettings,
  setSidebarView,
  focusAction,
  blurAction,
  updateFocusedAction,
  setActionView,
  setActionViewHeight,
  setIsPreview,
  updateFocusedActionState,
  resetEditor,
  startResizeComponent,
  stopResizeComponent,
} from '../editorSlice';

describe('editorSlice', () => {
  describe('create component', () => {
    it('startCreateComponentDrag: sets new component object', () => {
      const mockComponent = { name: 'name', type: ComponentType.Button };

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(initialState, startCreateComponentDrag(mockComponent));
      expect(state.newComponent).toEqual(mockComponent);
    });

    it('stopCreateComponentDrag: unsets new component', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
        newComponent: {
          name: 'name',
          type: ComponentType.Button,
        },
      };
      const state = editorReducer(initialState, stopCreateComponentDrag());
      expect(state.newComponent).toBeUndefined();
    });
  });

  describe('move', () => {
    it('startMoveComponentDrag: sets moving component name', () => {
      const mockComponentName = 'name';

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(initialState, startMoveComponentDrag(mockComponentName));
      expect(state.movingComponentName).toEqual(mockComponentName);
    });

    it('stopMoveComponentDrag: unsets moving component name', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
        movingComponentName: 'name',
      };
      const state = editorReducer(initialState, stopMoveComponentDrag());
      expect(state.movingComponentName).toBeUndefined();
    });
  });

  describe('resize', () => {
    it('startResizeComponent: sets resizing component name', () => {
      const mockComponentName = 'name';

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(initialState, startResizeComponent(mockComponentName));
      expect(state.resizingComponentName).toEqual(mockComponentName);
    });

    it('stopResizeComponent: unsets resizing component name', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
        resizingComponentName: 'name',
      };
      const state = editorReducer(initialState, stopResizeComponent());
      expect(state.resizingComponentName).toBeUndefined();
    });
  });

  describe('sidebar focus', () => {
    it('focusComponent: sets focused component name and changes sidebar view to Inspector', () => {
      const mockComponentName = 'name';

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(initialState, focusComponent(mockComponentName));
      expect(state.focusedComponentName).toEqual(mockComponentName);
      expect(state.sidebarView).toEqual(SidebarViewType.Inspector);
    });

    it('blurComponent: unsets focused component name and changes sidebar view to Components', () => {
      const initialState = {
        sidebarView: SidebarViewType.Inspector,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
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
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
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
          actionViewHeight: 0,
          isPreview: false,
          focusedActionState: {
            smartContractFunctionIndex: 0,
          },
          focusedComponentName: 'name',
        };
        const state = editorReducer(initialState, setSidebarView(sidebarView));
        expect(state.sidebarView).toEqual(sidebarView);
      }
    );
  });

  describe('actions', () => {
    it('focusAction: sets action view to general, focuses action, and resets action state', () => {
      const mockAction = {
        name: 'action1',
        type: ActionType.Javascript,
      } as Action;

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.ResponseHandler,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 1,
        },
      };
      const state = editorReducer(initialState, focusAction(mockAction));
      expect(state.focusedAction).toEqual(mockAction);
      expect(state.actionView).toEqual(ActionViewType.General);
      expect(state.focusedActionState).toEqual({
        smartContractFunctionIndex: 0,
      });
    });

    it('blurAction: sets focused action to undefined', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.ResponseHandler,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
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
          actionViewHeight: 0,
          isPreview: false,
          focusedActionState: {
            smartContractFunctionIndex: 0,
          },
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
          actionViewHeight: 0,
          isPreview: false,
          focusedActionState: {
            smartContractFunctionIndex: 0,
          },
          focusedAction: {
            name: 'action1',
            type: ActionType.Javascript,
            data: {},
            eventHandlers: [{ event: ActionEvent.Success }],
          } as Action,
        };
        const state = editorReducer(initialState, updateFocusedAction({ eventHandlers: [] }));
        expect(state.focusedAction).toEqual({
          name: 'action1',
          type: ActionType.Javascript,
          data: {},
          eventHandlers: [],
        });
      });
    });

    it('updateFocusedActionState: updates focused action state', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(
        initialState,
        updateFocusedActionState({ smartContractFunctionIndex: 1 })
      );
      expect(state.focusedActionState.smartContractFunctionIndex).toEqual(1);
    });

    it('setActionView: sets action view to payload type', () => {
      const mockActionViewType = ActionViewType.ResponseHandler;

      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(initialState, setActionView(ActionViewType.ResponseHandler));
      expect(state.actionView).toEqual(mockActionViewType);
    });

    it('setActionViewHeight: sets action view height to payload', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(initialState, setActionViewHeight(100));
      expect(state.actionViewHeight).toEqual(100);
    });
  });

  describe('general', () => {
    it('setIsPreview: sets preview boolean to payload', () => {
      const initialState = {
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: 0,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      };
      const state = editorReducer(initialState, setIsPreview(true));
      expect(state.isPreview).toEqual(true);
    });

    it('resetEditor: sets state back to initial state', () => {
      const initialState = {
        sidebarView: SidebarViewType.Inspector,
        actionView: ActionViewType.ResponseHandler,
        actionViewHeight: 100,
        isPreview: true,
        focusedActionState: {
          smartContractFunctionIndex: 1,
        },
      };
      const state = editorReducer(initialState, resetEditor());
      expect(state).toEqual({
        sidebarView: SidebarViewType.Components,
        actionView: ActionViewType.General,
        actionViewHeight: ACTION_VIEW_MIN_HEIGHT,
        isPreview: false,
        focusedActionState: {
          smartContractFunctionIndex: 0,
        },
      });
    });
  });
});
