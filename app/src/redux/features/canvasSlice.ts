/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ComponentType } from 'types';

// Define a type for the slice state
type CanvasState = {
  isCreating: boolean;
  newComponentType?: ComponentType;
};

const initialState: CanvasState = {
  isCreating: false,
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    startCreate: (state, action: PayloadAction<ComponentType>) => {
      state.isCreating = true;
      state.newComponentType = action.payload;
    },
    stopCreate: (state) => {
      state.isCreating = false;
      state.newComponentType = undefined;
    },
  },
});

export const { startCreate, stopCreate } = canvasSlice.actions;

export default canvasSlice.reducer;
