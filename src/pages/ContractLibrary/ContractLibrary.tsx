import React, { memo } from 'react';
import { Box } from '@mui/material';
import { useLoadContracts } from 'pages/ContractLibrary/hooks/useLoadContracts';
import { useAppSelector } from 'redux/hooks';
import { ContractSubmitter } from './components/ContractSubmitter';
import { ContractExplorer } from './components/ContractExplorer';

export const ContractLibrary = memo(() => {
  useLoadContracts();

  return (
    <Box>
      <ContractSubmitter />
      <ContractExplorer />
    </Box>
  );
});
