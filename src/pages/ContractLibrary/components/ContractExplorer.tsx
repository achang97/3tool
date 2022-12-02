import React, { memo, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { ethers } from 'ethers';
import { deleteContract } from 'redux/features/contractsSlice';

export const ContractExplorer = memo(() => {
  const { contracts } = useAppSelector((state) => state.contracts);
  const dispatch = useAppDispatch();

  const renderFunction = useCallback(
    (contract: ethers.Contract, func: ethers.utils.FunctionFragment) => {
      const inputsString = func.inputs
        .map((input) => `${input.type} ${input.name}`)
        .join(', ');

      const handleFunctionClick = async () => {
        const val = await contract[func.name]();
        alert(`${func.name}: ${val}`);
      };

      return (
        <Box key={func.name}>
          <Typography>
            <Button
              onClick={handleFunctionClick}
              sx={{ textTransform: 'none' }}
            >
              {func.payable && '[Payable]'} {func.name}({inputsString})
            </Button>
          </Typography>
        </Box>
      );
    },
    []
  );

  const renderContract = useCallback(
    (contract: ethers.Contract) => {
      const handleDeleteContract = () => {
        dispatch(deleteContract(contract.address));
      };

      return (
        <Box key={contract.address}>
          <Typography>Address: {contract.address}</Typography>
          {Object.values(contract.interface.functions).map((func) =>
            renderFunction(contract, func)
          )}
          <Button onClick={handleDeleteContract} variant="outlined">
            Delete Contract
          </Button>
        </Box>
      );
    },
    [dispatch, renderFunction]
  );

  return (
    <Box sx={{ flexDirection: 'column' }}>{contracts.map(renderContract)}</Box>
  );
});
