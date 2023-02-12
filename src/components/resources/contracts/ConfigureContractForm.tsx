import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { CHAINS } from '@app/constants';
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  MenuItem,
  SxProps,
  TextField,
} from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { mainnet } from 'wagmi';
import { isJSON } from '@app/utils/string';
import { Resource, ResourceType } from '@app/types';
import { useAppSelector } from '@app/redux/hooks';
import { AddressTextField } from './AddressTextField';
import { AbiTextField } from './AbiTextField';
import { useFetchAbi } from '../hooks/useFetchAbi';

type ConfigureContractFormProps = {
  formId: string;
  onSubmit: (resource: Pick<Resource, 'type' | 'name' | 'data'>) => void;
};

type FormContainerProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const FormContainer = ({ children, sx }: FormContainerProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}>
      {children}
    </Box>
  );
};

export const ConfigureContractForm = ({
  formId,
  onSubmit,
}: ConfigureContractFormProps) => {
  const { activeResource } = useAppSelector((state) => state.resources);

  const [name, setName] = useState(activeResource?.name ?? '');
  const [chainId, setChainId] = useState<number>(
    activeResource?.data.smartContract?.chainId ?? mainnet.id
  );
  const [address, setAddress] = useState(
    activeResource?.data.smartContract?.address ?? ''
  );
  const [abi, setAbi] = useState(activeResource?.data.smartContract?.abi ?? '');
  const [isProxy, setIsProxy] = useState(
    activeResource?.data.smartContract?.isProxy ?? false
  );
  const [logicAddress, setLogicAddress] = useState(
    activeResource?.data.smartContract?.logicAddress ?? ''
  );
  const [logicAbi, setLogicAbi] = useState(
    activeResource?.data.smartContract?.logicAbi ?? ''
  );

  const { error: fetchAbiError, isLoading: isLoadingAbi } = useFetchAbi({
    abi,
    address,
    chainId,
    onAbiChange: setAbi,
  });
  const { error: fetchLogicAbiError, isLoading: isLoadingLogicAbi } =
    useFetchAbi({
      abi: logicAbi,
      address: logicAddress,
      chainId,
      onAbiChange: setLogicAbi,
    });

  const isAbiShown = useMemo(
    () => isAddress(address) && !fetchAbiError && !isLoadingAbi,
    [address, fetchAbiError, isLoadingAbi]
  );
  const isLogicAbiShown = useMemo(
    () => isAddress(logicAddress) && !fetchLogicAbiError && !isLoadingLogicAbi,
    [logicAddress, fetchLogicAbiError, isLoadingLogicAbi]
  );

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
      setAbi('');
    },
    []
  );

  const handleAbiChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAbi(e.target.value);
  }, []);

  const handleLogicAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLogicAddress(e.target.value);
      setLogicAbi('');
    },
    []
  );

  const handleLogicAbiChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLogicAbi(e.target.value);
    },
    []
  );

  const handleNetworkChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setChainId(parseInt(e.target.value, 10));
      setAbi('');
      setLogicAbi('');
    },
    []
  );

  const handleIsProxyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsProxy(e.target.checked);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isAddress(address) || !isJSON(abi)) {
        return;
      }

      if (isProxy && (!isAddress(logicAddress) || !isJSON(logicAbi))) {
        return;
      }

      onSubmit({
        type: ResourceType.SmartContract,
        name,
        data: {
          smartContract: {
            chainId,
            address,
            abi,
            isProxy,
            logicAddress: isProxy ? logicAddress : undefined,
            logicAbi: isProxy ? logicAbi : undefined,
          },
        },
      });
    },
    [onSubmit, name, chainId, address, abi, isProxy, logicAddress, logicAbi]
  );

  const primaryInputs = useMemo(
    () => (
      <>
        <TextField
          label="Name"
          placeholder="Enter contract name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <TextField
          value={chainId}
          placeholder="Select contract network"
          label="Network"
          onChange={handleNetworkChange}
          select
          required
          inputProps={{
            'data-testid': 'configure-contract-form-network-select',
          }}
        >
          {CHAINS.map((chain) => (
            <MenuItem key={chain.id} value={chain.id}>
              {chain.name}
            </MenuItem>
          ))}
        </TextField>
        <AddressTextField
          value={address}
          placeholder="Enter contract address"
          label="Address"
          onChange={handleAddressChange}
          fetchAbiError={fetchAbiError}
          required
        />
      </>
    ),
    [
      name,
      handleNameChange,
      chainId,
      handleNetworkChange,
      address,
      handleAddressChange,
      fetchAbiError,
    ]
  );

  const secondaryInputs = useMemo(
    () => (
      <>
        <AbiTextField
          value={abi}
          placeholder="Enter ABI"
          label="ABI"
          onChange={handleAbiChange}
          required
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isProxy}
              onChange={handleIsProxyChange}
              inputProps={{
                // @ts-ignore data-testid should be defined as a valid prop
                'data-testid': 'configure-contract-form-proxy-checkbox',
              }}
            />
          }
          label="This is a proxy contract"
          componentsProps={{ typography: { variant: 'body2' } }}
        />
      </>
    ),
    [abi, handleAbiChange, handleIsProxyChange, isProxy]
  );

  const proxyInputs = useMemo(
    () => (
      <>
        <AddressTextField
          value={logicAddress}
          placeholder="Enter logic contract address"
          label="Logic Address"
          onChange={handleLogicAddressChange}
          fetchAbiError={fetchLogicAbiError}
          required={isProxy}
        />
        <Collapse in={isLogicAbiShown}>
          <AbiTextField
            value={logicAbi}
            placeholder="Enter logic contract ABI"
            label="Logic ABI"
            onChange={handleLogicAbiChange}
            fullWidth
            required={isProxy}
          />
        </Collapse>
      </>
    ),
    [
      fetchLogicAbiError,
      handleLogicAbiChange,
      handleLogicAddressChange,
      isLogicAbiShown,
      isProxy,
      logicAbi,
      logicAddress,
    ]
  );

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <FormContainer>{primaryInputs}</FormContainer>
      <Collapse in={isAbiShown}>
        <FormContainer sx={{ marginTop: 1 }}>
          <FormContainer>{secondaryInputs}</FormContainer>
          <Collapse in={isProxy}>
            <FormContainer>{proxyInputs}</FormContainer>
          </Collapse>
        </FormContainer>
      </Collapse>
    </form>
  );
};
