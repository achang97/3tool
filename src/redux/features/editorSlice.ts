import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Action, ActionViewType, ComponentType, SidebarViewType } from '@app/types';
import _ from 'lodash';
import { overwriteArrayMergeCustomizer } from '@app/components/editor/utils/javascript';
import { ACTION_VIEW_MIN_HEIGHT } from '@app/constants';

type NewComponent = {
  name: string;
  type: ComponentType;
};

type EditorState = {
  // Create new component
  newComponent?: NewComponent;
  deletingComponentName?: string;

  // Reposition
  movingComponentName?: string;
  resizingComponentName?: string;
  focusedComponentName?: string;

  // Sidebar
  sidebarView: SidebarViewType;

  // Actions
  focusedAction?: Action;
  actionView: ActionViewType;
  actionViewHeight: number;
  focusedActionState: {
    smartContractFunctionIndex: number;
  };

  // General
  isPreview: boolean;
};

const initialState: EditorState = {
  sidebarView: SidebarViewType.Components,
  actionView: ActionViewType.General,
  actionViewHeight: ACTION_VIEW_MIN_HEIGHT,
  isPreview: false,
  focusedActionState: {
    smartContractFunctionIndex: 0,
  },
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Create
    startCreateComponentDrag: (state, action: PayloadAction<NewComponent>) => {
      state.newComponent = action.payload;
    },
    stopCreateComponentDrag: (state) => {
      state.newComponent = undefined;
    },

    // Move
    startMoveComponentDrag: (state, action: PayloadAction<string>) => {
      state.movingComponentName = action.payload;
    },
    stopMoveComponentDrag: (state) => {
      state.movingComponentName = undefined;
    },

    // Resize
    startResizeComponent: (state, action: PayloadAction<string>) => {
      state.resizingComponentName = action.payload;
    },
    stopResizeComponent: (state) => {
      state.resizingComponentName = undefined;
    },

    // Delete
    setComponentToDelete: (state, action: PayloadAction<string | undefined>) => {
      state.deletingComponentName = action.payload;
    },

    // Sidebar
    focusComponent: (state, action: PayloadAction<string>) => {
      state.focusedComponentName = action.payload;
      state.sidebarView = SidebarViewType.Inspector;
    },
    blurComponent: (state) => {
      state.focusedComponentName = undefined;
      state.sidebarView = SidebarViewType.Components;
    },
    focusToolSettings: (state) => {
      state.focusedComponentName = undefined;
      state.sidebarView = SidebarViewType.Inspector;
    },
    setSidebarView: (state, action: PayloadAction<SidebarViewType>) => {
      state.sidebarView = action.payload;
    },

    // Actions
    focusAction: (state, action: PayloadAction<Action>) => {
      state.focusedAction = action.payload;
      state.focusedActionState = initialState.focusedActionState;
      state.actionView = ActionViewType.General;
    },
    blurAction: (state) => {
      state.focusedAction = undefined;
    },
    updateFocusedAction: (state, action: PayloadAction<RecursivePartial<Action>>) => {
      _.mergeWith(state.focusedAction, action.payload, overwriteArrayMergeCustomizer);
    },
    updateFocusedActionState: (
      state,
      action: PayloadAction<Partial<EditorState['focusedActionState']>>
    ) => {
      _.merge(state.focusedActionState, action.payload);
    },
    setActionView: (state, action: PayloadAction<ActionViewType>) => {
      state.actionView = action.payload;
    },
    setActionViewHeight: (state, action: PayloadAction<number>) => {
      state.actionViewHeight = action.payload;
    },

    // General
    setIsPreview: (state, action: PayloadAction<boolean>) => {
      state.isPreview = action.payload;
    },
    resetEditor: () => {
      return initialState;
    },
  },
});

export const {
  startCreateComponentDrag,
  stopCreateComponentDrag,
  startMoveComponentDrag,
  stopMoveComponentDrag,
  startResizeComponent,
  stopResizeComponent,
  setComponentToDelete,
  focusComponent,
  blurComponent,
  focusToolSettings,
  setSidebarView,
  focusAction,
  blurAction,
  updateFocusedAction,
  updateFocusedActionState,
  setActionView,
  setActionViewHeight,
  setIsPreview,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
