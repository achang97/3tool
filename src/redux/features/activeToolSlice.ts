import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type ToolState = {
  componentInputs: Record<string, unknown>;
};

const initialState: ToolState = {
  componentInputs: {},
};

export const activeToolSlice = createSlice({
  name: 'activeTool',
  initialState,
  reducers: {
    resetComponentInput: (state, action: PayloadAction<string>) => {
      delete state.componentInputs[action.payload];
    },
    renameComponentInput: (
      state,
      action: PayloadAction<{ prevName: string; newName: string }>
    ) => {
      state.componentInputs[action.payload.newName] =
        state.componentInputs[action.payload.prevName];
      delete state.componentInputs[action.payload.prevName];
    },
    setComponentInput: (
      state,
      action: PayloadAction<{ name: string; input: unknown }>
    ) => {
      const { name, input } = action.payload;
      state.componentInputs[name] = input;
    },
  },
});

export const { resetComponentInput, renameComponentInput, setComponentInput } =
  activeToolSlice.actions;

export default activeToolSlice.reducer;
