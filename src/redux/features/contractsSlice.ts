/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ContractConfig } from 'types';

type ContractsState = {
  configs: ContractConfig[];
};

const initialState: ContractsState = {
  configs: [],
};

export const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    addContract: (state, action: PayloadAction<ContractConfig>) => {
      const isExistingAddress = state.configs.find(
        (config) => config.address === action.payload.address
      );

      if (!isExistingAddress) {
        // @ts-ignore Invalid type incompatibility
        state.configs.push(action.payload);
      }
    },
    deleteContract: (state, action: PayloadAction<string>) => {
      state.configs = state.configs.filter(
        (config) => config.address !== action.payload
      );
    },
  },
});

export const { addContract, deleteContract } = contractsSlice.actions;

export default contractsSlice.reducer;
