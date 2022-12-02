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
import { NETWORKS } from 'utils/constants';
import { NetworkType } from 'types';
import { useAppDispatch } from 'redux/hooks';
import { addContract } from 'redux/features/contractsSlice';

export const ContractSubmitter = memo(() => {
  const [network, setNetwork] = useState<NetworkType>(NetworkType.Mainnet);
  const [address, setAddress] = useState('');
  const [abi, setAbi] = useState('');

  const dispatch = useAppDispatch();

  const handleNetworkChange = useCallback(
    (e: SelectChangeEvent<NetworkType>) => {
      setNetwork(e.target.value as NetworkType);
    },
    []
  );

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
    // TODO: We need to try to load the contract here, or at least check its validity before
    // adding it to the configs array
    dispatch(addContract({ network, address, abi }));
  }, [network, address, abi, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography>Add Contract</Typography>
      <Select required value={network} onChange={handleNetworkChange}>
        {Object.values(NETWORKS).map(({ name }) => (
          <MenuItem key={name} value={name}>
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
