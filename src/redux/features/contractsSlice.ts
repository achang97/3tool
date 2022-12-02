/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ContractConfig } from 'types';
import { ethers } from 'ethers';

type ContractsState = {
  configs: ContractConfig[];
  contracts: ethers.Contract[];
};

const initialState: ContractsState = {
  configs: [],
  contracts: [],
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
        state.configs.push(action.payload);
      }
    },
    deleteContract: (state, action: PayloadAction<string>) => {
      state.configs = state.configs.filter(
        (config) => config.address !== action.payload
      );
      state.contracts = state.contracts.filter(
        (contract) => contract.address !== action.payload
      );
    },
    updateContracts: (state, action: PayloadAction<ethers.Contract[]>) => {
      // @ts-ignore Invalid type incompatibility
      state.contracts = action.payload;
    },
  },
});

export const { addContract, deleteContract, updateContracts } =
  contractsSlice.actions;

export default contractsSlice.reducer;
