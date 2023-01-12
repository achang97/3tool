import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ComponentType, SidebarViewType } from '@app/types';
import { Layout } from 'react-grid-layout';
import { getNewComponentId } from '../utils/editor';

type EditorState = {
  // General layout information
  layout: Layout[];
  components: Record<string, ComponentType>;

  // Create new component
  newComponent?: {
    id: string;
    type: ComponentType;
  };

  // Reposition
  movingComponentId?: string;
  focusedComponentId?: string;

  // Sidebar
  sidebarView: SidebarViewType;
};

const initialState: EditorState = {
  layout: [],
  components: {},
  sidebarView: SidebarViewType.Components,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    startCreateComponentDrag: (state, action: PayloadAction<ComponentType>) => {
      state.newComponent = {
        id: getNewComponentId(action.payload, Object.keys(state.components)),
        type: action.payload,
      };
    },
    endCreateComponentDrag: (state) => {
      state.newComponent = undefined;
    },
    createComponent: (
      state,
      action: PayloadAction<{
        id: string;
        type: ComponentType;
      }>
    ) => {
      state.components[action.payload.id] = action.payload.type;
    },

    startMoveComponentDrag: (state, action: PayloadAction<string>) => {
      state.movingComponentId = action.payload;
    },
    endMoveComponentDrag: (state) => {
      state.movingComponentId = undefined;
    },

    deleteComponent: (state, action: PayloadAction<string>) => {
      state.layout = state.layout.filter(({ i }) => i !== action.payload);
      delete state.components[action.payload];
    },

    focusComponent: (state, action: PayloadAction<string>) => {
      state.focusedComponentId = action.payload;
      state.sidebarView = SidebarViewType.Inspector;
    },
    blurComponentFocus: (state) => {
      state.focusedComponentId = undefined;
      state.sidebarView = SidebarViewType.Components;
    },
    focusToolSettings: (state) => {
      state.focusedComponentId = undefined;
      state.sidebarView = SidebarViewType.Inspector;
    },
    setSidebarView: (state, action: PayloadAction<SidebarViewType>) => {
      state.sidebarView = action.payload;
    },

    updateLayout: (state, action: PayloadAction<Layout[]>) => {
      state.layout = action.payload;
    },
  },
});

export const {
  startCreateComponentDrag,
  createComponent,
  endCreateComponentDrag,
  startMoveComponentDrag,
  endMoveComponentDrag,
  deleteComponent,
  focusComponent,
  blurComponentFocus,
  updateLayout,
  focusToolSettings,
  setSidebarView,
} = editorSlice.actions;

export default editorSlice.reducer;
