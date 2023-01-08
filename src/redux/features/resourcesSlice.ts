import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Resource } from '@app/types';

type ResourcesState = {
  activeResource?: Resource;
};

const initialState: ResourcesState = {};

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setActiveResource: (state, action: PayloadAction<Resource | undefined>) => {
      state.activeResource = action.payload;
    },
  },
});

export const { setActiveResource } = resourcesSlice.actions;

export default resourcesSlice.reducer;
