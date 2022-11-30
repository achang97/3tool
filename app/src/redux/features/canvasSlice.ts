/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ComponentType } from 'types';
import { Layout } from 'react-grid-layout';

type CanvasState = {
  // General layout information
  layout: Layout[];
  components: Record<string, ComponentType>;

  // Create new component
  newComponent?: {
    id: string;
    type: ComponentType;
  };

  // Reposition
  movedComponentId?: string;
};

const initialState: CanvasState = {
  layout: [],
  components: {},
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    startCreateComponentDrag: (state, action: PayloadAction<ComponentType>) => {
      state.newComponent = {
        id: Math.floor(Math.random() * 100_000_000).toString(),
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
      state.movedComponentId = action.payload;
    },
    endMoveComponent: (state) => {
      state.movedComponentId = undefined;
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
  startMoveComponent,
  endMoveComponent,
  updateLayout,
} = canvasSlice.actions;

export default canvasSlice.reducer;
