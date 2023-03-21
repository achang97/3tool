import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  Action,
  ActionViewType,
  ComponentType,
  SidebarViewType,
} from '@app/types';
import _ from 'lodash';

type NewComponent = {
  name: string;
  type: ComponentType;
};

type EditorState = {
  // Create new component
  newComponent?: NewComponent;

  // Reposition
  movingComponentName?: string;
  focusedComponentName?: string;

  // Sidebar
  sidebarView: SidebarViewType;

  // Actions
  focusedAction?: Action;
  actionView: ActionViewType;
};

const initialState: EditorState = {
  sidebarView: SidebarViewType.Components,
  actionView: ActionViewType.General,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Create
    startCreateComponentDrag: (state, action: PayloadAction<NewComponent>) => {
      state.newComponent = action.payload;
    },
    endCreateComponentDrag: (state) => {
      state.newComponent = undefined;
    },

    // Move
    startMoveComponentDrag: (state, action: PayloadAction<string>) => {
      state.movingComponentName = action.payload;
    },
    endMoveComponentDrag: (state) => {
      state.movingComponentName = undefined;
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
      state.actionView = ActionViewType.General;
    },
    blurAction: (state) => {
      state.focusedAction = undefined;
    },
    updateFocusedAction: (
      state,
      action: PayloadAction<RecursivePartial<Action>>
    ) => {
      _.merge(state.focusedAction, action.payload);
    },
    setActionView: (state, action: PayloadAction<ActionViewType>) => {
      state.actionView = action.payload;
    },
  },
});

export const {
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
} = editorSlice.actions;

export default editorSlice.reducer;
