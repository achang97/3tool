import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { CHAINS } from '@app/utils/constants';
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { mainnet } from 'wagmi';
import { isJSON } from '@app/utils/string';
import { useFetchAbi } from './hooks/useFetchAbi';

export const ConfigureContractForm = () => {
  const [name, setName] = useState('');
  const [chainId, setChainId] = useState<number>(mainnet.id);
  const [address, setAddress] = useState('');
  const [abi, setAbi] = useState('');
  const [isProxy, setIsProxy] = useState(false);
  const [logicAddress, setLogicAddress] = useState('');
  const [logicAbi, setLogicAbi] = useState('');

  useFetchAbi({ address, chainId, onSuccess: setAbi });
  useFetchAbi({ address: logicAddress, chainId, onSuccess: setLogicAbi });

  const isValidAddress = useMemo(
    () => !address || isAddress(address),
    [address]
  );

  const isValidAbi = useMemo(() => !abi || isJSON(abi), [abi]);

  const isValidLogicAddress = useMemo(
    () => !logicAddress || isAddress(logicAddress),
    [logicAddress]
  );

  const isValidLogicAbi = useMemo(
    () => !logicAbi || isJSON(logicAbi),
    [logicAbi]
  );

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleNetworkChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setChainId(parseInt(e.target.value, 10));
    },
    []
  );

  const handleAddressChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
    },
    []
  );

  const handleAbiChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAbi(e.target.value);
  }, []);

  const handleLogicAddressChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setLogicAddress(e.target.value);
    },
    []
  );

  const handleLogicAbiChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLogicAbi(e.target.value);
    },
    []
  );

  const handleIsProxyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsProxy(e.target.checked);
    },
    []
  );

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          size="small"
          value={name}
          onChange={handleNameChange}
          required
        />
        <TextField
          value={chainId}
          label="Network"
          onChange={handleNetworkChange}
          size="small"
          select
          required
        >
          {CHAINS.map((chain) => (
            <MenuItem key={chain.id} value={chain.id}>
              {chain.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Address"
          size="small"
          value={address}
          onChange={handleAddressChange}
          error={!isValidAddress}
          helperText={!isValidAddress && 'Invalid address'}
          required
        />
        <TextField
          multiline
          label="ABI"
          size="small"
          value={abi}
          error={!isValidAbi}
          helperText={!isValidAbi && 'Invalid JSON'}
          onChange={handleAbiChange}
          maxRows={10}
          InputProps={{
            style: {
              fontFamily: 'monospace',
            },
          }}
          required
        />
        <FormControlLabel
          control={<Checkbox value={isProxy} onChange={handleIsProxyChange} />}
          label="Proxy?"
        />{' '}
      </Box>
      <Collapse in={isProxy}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginTop: 2,
          }}
        >
          <TextField
            label="Logic Address"
            size="small"
            value={logicAddress}
            onChange={handleLogicAddressChange}
            error={!isValidLogicAddress}
            helperText={!isValidLogicAddress && 'Invalid address'}
          />
          <TextField
            multiline
            label="Logic ABI"
            size="small"
            value={logicAbi}
            error={!isValidLogicAbi}
            helperText={!isValidLogicAbi && 'Invalid JSON'}
            onChange={handleLogicAbiChange}
            maxRows={10}
            InputProps={{
              style: {
                fontFamily: 'monospace',
              },
            }}
          />
        </Box>
      </Collapse>
    </>
  );
};
