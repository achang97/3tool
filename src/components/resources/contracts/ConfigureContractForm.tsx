import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';
import { CHAINS } from '@app/constants';
import {
  Checkbox,
  Collapse,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { mainnet } from 'wagmi';
import { Resource } from '@app/types';
import { useAppSelector } from '@app/redux/hooks';
import { isJSON } from '@app/utils/string';
import { FormContainer } from './FormContainer';
import { AddressAbiFieldGroup } from './AddressAbiFieldGroup';
import { useSubmitSmartContract } from '../hooks/useSubmitSmartContract';

type ConfigureContractFormProps = {
  formId: string;
  onSubmit: (resource: Pick<Resource, 'type' | 'name' | 'data'>) => void;
};

export const ConfigureContractForm = ({
  formId,
  onSubmit,
}: ConfigureContractFormProps) => {
  const { activeResource } = useAppSelector((state) => state.resources);
  const smartContract = useMemo(() => {
    return activeResource?.data.smartContract;
  }, [activeResource?.data]);

  const [name, setName] = useState(activeResource?.name ?? '');
  const [chainId, setChainId] = useState<number>(
    smartContract?.chainId ?? mainnet.id
  );
  const [address, setAddress] = useState(smartContract?.address ?? '');
  const [abi, setAbi] = useState(smartContract?.abi ?? '');
  const [isProxy, setIsProxy] = useState(smartContract?.isProxy ?? false);
  const [logicAddress, setLogicAddress] = useState(
    smartContract?.logicAddress ?? ''
  );
  const [logicAbi, setLogicAbi] = useState(smartContract?.logicAbi ?? '');

  const handleSubmitSmartContract = useSubmitSmartContract({
    name,
    smartContract: { chainId, address, abi, logicAddress, logicAbi, isProxy },
    onSubmit,
  });

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

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
      handleSubmitSmartContract();
    },
    [handleSubmitSmartContract]
  );

  const isLogicSectionShown = useMemo(() => {
    return isJSON(abi) && isProxy;
  }, [abi, isProxy]);

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <FormContainer>
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
        <AddressAbiFieldGroup
          address={address}
          abi={abi}
          chainId={chainId}
          addressTextFieldProps={{
            label: 'Address',
            placeholder: 'Enter contract address',
            onChange: setAddress,
          }}
          abiTextFieldProps={{
            label: 'ABI',
            placeholder: 'Enter contract ABI',
            onChange: setAbi,
          }}
          required
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
      </FormContainer>
      <Collapse in={isLogicSectionShown}>
        <FormContainer sx={{ marginTop: 1 }}>
          <AddressAbiFieldGroup
            address={logicAddress}
            abi={logicAbi}
            chainId={chainId}
            addressTextFieldProps={{
              label: 'Logic Address',
              placeholder: 'Enter logic contract address',
              onChange: setLogicAddress,
            }}
            abiTextFieldProps={{
              label: 'Logic ABI',
              placeholder: 'Enter logic contract ABI',
              onChange: setLogicAbi,
            }}
            required={isProxy}
          />
        </FormContainer>
      </Collapse>
    </form>
  );
};
