import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ActionResult } from '@app/constants';

type ToolState = {
  // Component inputs
  componentInputs: Record<string, unknown>;

  // Action data
  actionResults: Record<string, ActionResult>;
};

const initialState: ToolState = {
  componentInputs: {},
  actionResults: {},
};

export const activeToolSlice = createSlice({
  name: 'activeTool',
  initialState,
  reducers: {
    // Component Inputs
    setComponentInput: (state, action: PayloadAction<{ name: string; input: unknown }>) => {
      const { name, input } = action.payload;
      state.componentInputs[name] = input;
    },
    resetComponentInput: (state, action: PayloadAction<string>) => {
      delete state.componentInputs[action.payload];
    },
    renameComponentInput: (state, action: PayloadAction<{ prevName: string; newName: string }>) => {
      state.componentInputs[action.payload.newName] =
        state.componentInputs[action.payload.prevName];
      delete state.componentInputs[action.payload.prevName];
    },

    // Action Results
    startActionExecute: (state, action: PayloadAction<string>) => {
      state.actionResults[action.payload] = {
        ...state.actionResults[action.payload],
        isLoading: true,
      };
    },
    setActionResult: (state, action: PayloadAction<{ name: string; result: ActionResult }>) => {
      const { name, result } = action.payload;
      state.actionResults[name] = result;
    },
    resetActionResult: (state, action: PayloadAction<string>) => {
      delete state.actionResults[action.payload];
    },
    renameActionResult: (state, action: PayloadAction<{ prevName: string; newName: string }>) => {
      state.actionResults[action.payload.newName] = state.actionResults[action.payload.prevName];
      delete state.actionResults[action.payload.prevName];
    },

    // Reset
    resetActiveTool: () => {
      return initialState;
    },
  },
});

export const {
  setComponentInput,
  resetComponentInput,
  renameComponentInput,
  startActionExecute,
  setActionResult,
  resetActionResult,
  renameActionResult,
  resetActiveTool,
} = activeToolSlice.actions;

export default activeToolSlice.reducer;
