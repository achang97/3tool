import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ComponentType, SidebarViewType } from '@app/types';
import { Layout } from 'react-grid-layout';

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
        id: `${action.payload}-${Math.floor(
          Math.random() * 100_000_000
        ).toString()}`,
        type: action.payload,
      };
    },
    createComponent: (state) => {
      const { newComponent } = state;
      state.components[newComponent!.id] = newComponent!.type;
    },
    endCreateComponentDrag: (state) => {
      state.newComponent = undefined;
    },

    startMoveComponent: (state, action: PayloadAction<string>) => {
      state.movingComponentId = action.payload;
    },
    endMoveComponent: (state) => {
      state.movingComponentId = undefined;
    },

    deleteComponent: (state, action: PayloadAction<string>) => {
      state.layout = state.layout.filter(({ i }) => i !== action.payload);
      delete state.components[action.payload];
    },

    focusComponent: (state, action: PayloadAction<string>) => {
      state.focusedComponentId = action.payload;
    },
    blurFocus: (state) => {
      state.focusedComponentId = undefined;
    },

    updateLayout: (state, action: PayloadAction<Layout[]>) => {
      state.layout = action.payload;
    },

    updateSidebarView: (state, action: PayloadAction<SidebarViewType>) => {
      state.sidebarView = action.payload;
    },
  },
});

export const {
  startCreateComponentDrag,
  createComponent,
  endCreateComponentDrag,
  startMoveComponent,
  endMoveComponent,
  deleteComponent,
  focusComponent,
  blurFocus,
  updateLayout,
  updateSidebarView,
} = editorSlice.actions;

export default editorSlice.reducer;
