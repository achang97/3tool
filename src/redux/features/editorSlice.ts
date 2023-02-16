import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ComponentType, SidebarViewType } from '@app/types';

type NewComponent = {
  name: string;
  type: ComponentType;
};

export type SnackbarMessage = {
  type: 'success' | 'error';
  message: string;
};

type EditorState = {
  // Create new component
  newComponent?: NewComponent;

  // Reposition
  movingComponentName?: string;
  focusedComponentName?: string;

  // Global messages
  snackbarMessage?: SnackbarMessage;

  // Sidebar
  sidebarView: SidebarViewType;

  // Actions
  focusedActionName?: string;
};

const initialState: EditorState = {
  sidebarView: SidebarViewType.Components,
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
    focusAction: (state, action: PayloadAction<string>) => {
      state.focusedActionName = action.payload;
    },
    blurAction: (state) => {
      state.focusedActionName = undefined;
    },

    // Global messages
    setSnackbarMessage: (
      state,
      action: PayloadAction<SnackbarMessage | undefined>
    ) => {
      state.snackbarMessage = action.payload;
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
  setSnackbarMessage,
} = editorSlice.actions;

export default editorSlice.reducer;
