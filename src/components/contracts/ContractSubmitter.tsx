import React, { ChangeEvent, memo, useCallback, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { CHAINS } from 'utils/constants';
import { useAppDispatch } from 'redux/hooks';
import { addContract } from 'redux/features/contractsSlice';
import { chain } from 'wagmi';
import { getContract } from '@wagmi/core';
import { getContractAbi } from 'utils/contracts';

export const ContractSubmitter = memo(() => {
  const [chainId, setChainId] = useState<number>(chain.mainnet.id);
  const [address, setAddress] = useState('');
  const [abi, setAbi] = useState('');

  const dispatch = useAppDispatch();

  const handleNetworkChange = useCallback((e: SelectChangeEvent<number>) => {
    setChainId(e.target.value as number);
  }, []);

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
    },
    []
  );

  const handleAbiChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAbi(e.target.value);
  }, []);

  const handleAddContract = useCallback(async () => {
    try {
      const contractAbi = abi
        ? JSON.parse(abi)
        : await getContractAbi(address, chainId);

      const contractConfig = { chainId, address, abi: contractAbi };

      getContract(contractConfig);
      dispatch(addContract(contractConfig));
    } catch (e) {
      alert(e);
    }
  }, [chainId, address, abi, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography>Add Contract</Typography>
      <Select required value={chainId} onChange={handleNetworkChange}>
        {CHAINS.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Address"
        variant="outlined"
        required
        value={address}
        onChange={handleAddressChange}
      />
      <TextField
        label="ABI (Optional)"
        variant="outlined"
        multiline
        required={false}
        value={abi}
        onChange={handleAbiChange}
      />
      <Button variant="outlined" onClick={handleAddContract}>
        Add Contract
      </Button>
    </Box>
  );
});
