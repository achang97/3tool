import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useAppDispatch } from '@app/redux/hooks';
import { deleteContract } from '@app/redux/features/contractsSlice';
import { Box, Button, Link, Typography } from '@mui/material';

type ContractProps = {
  contract: ethers.Contract;
  blockExplorerUrl?: string;
};

export const Contract = ({ contract, blockExplorerUrl }: ContractProps) => {
  const dispatch = useAppDispatch();

  const renderFunction = useCallback(
    (func: ethers.utils.FunctionFragment) => {
      const inputsString = func.inputs
        .map((input) => `${input.type} ${input.name}`)
        .join(', ');

      const handleFunctionClick = async () => {
        try {
          const val = await contract[func.name]();
          alert(`${func.name}: ${val}`);
        } catch (e) {
          // eslint-disable-next-line no-alert
          alert(e);
        }
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
    [contract]
  );

  const handleDeleteContract = useCallback(() => {
    dispatch(deleteContract(contract.address));
  }, [dispatch, contract]);

  return (
    <Box key={contract.address}>
      {blockExplorerUrl && (
        <Link
          href={`${blockExplorerUrl}/address/${contract.address}`}
          target="_blank"
        >
          Etherscan
        </Link>
      )}
      {Object.values(contract.interface.functions).map((func) =>
        renderFunction(func)
      )}
      <Button onClick={handleDeleteContract} variant="outlined">
        Delete Contract
      </Button>
    </Box>
  );
};
