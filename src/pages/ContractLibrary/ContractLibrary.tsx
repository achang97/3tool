import React, { memo } from 'react';
import { Box } from '@mui/material';
import { ContractSubmitter } from './components/ContractSubmitter';
import { ContractExplorer } from './components/ContractExplorer';

export const ContractLibrary = memo(() => {
  return (
    <Box>
      <ContractSubmitter />
      <ContractExplorer />
    </Box>
  );
});
