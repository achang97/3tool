import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Resource } from '@app/types';
import _ from 'lodash';

export type ResourceStackElement = {
  type: 'create' | 'edit';
  resource: Resource;
};

type ResourcesState = {
  resourceStack: ResourceStackElement[];
};

const initialState: ResourcesState = {
  resourceStack: [],
};

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    pushResource: (state, action: PayloadAction<ResourceStackElement>) => {
      state.resourceStack.unshift(action.payload);
    },
    popResource: (state) => {
      state.resourceStack = state.resourceStack.slice(1);
    },
    updateResource: (
      state,
      action: PayloadAction<{
        index: number;
        update: RecursivePartial<Resource>;
      }>
    ) => {
      if (action.payload.index < 0 || action.payload.index >= state.resourceStack.length) {
        return;
      }

      state.resourceStack[action.payload.index].resource = _.merge(
        state.resourceStack[action.payload.index].resource,
        action.payload.update
      );
    },
  },
});

export const { pushResource, popResource, updateResource } = resourcesSlice.actions;

export default resourcesSlice.reducer;
