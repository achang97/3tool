import { ChangeEvent, useCallback } from 'react';
import { CHAINS, RESOURCE_DATA_TEMPLATES } from '@app/constants';
import { Button, MenuItem, TextField } from '@mui/material';
import { Resource, ResourceType } from '@app/types';
import { Select } from '@app/components/common/Select';
import { BaseResourceFormProps } from '@app/types/resources';
import { useAppDispatch } from '@app/redux/hooks';
import { pushResource } from '@app/redux/features/resourcesSlice';
import { AddressTextField } from './AddressTextField';
import { FormContainer } from '../common/FormContainer';
import { useAbiResources } from '../hooks/useAbiResources';
import { useFetchAbi } from '../hooks/useFetchAbi';

export const SmartContractForm = ({
  name,
  data,
  onDataChange,
  onNameChange,
}: BaseResourceFormProps<ResourceType.SmartContract>) => {
  const dispatch = useAppDispatch();

  const abis = useAbiResources();
  const { abi: fetchedAbi } = useFetchAbi({
    chainId: data?.chainId,
    address: data?.address,
  });

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onNameChange(e.target.value);
    },
    [onNameChange]
  );

  const handleNetworkChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onDataChange({ chainId: parseInt(e.target.value, 10) });
    },
    [onDataChange]
  );

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onDataChange({ address: e.target.value });
    },
    [onDataChange]
  );

  const handleAbiChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onDataChange({ abiId: e.target.value });
    },
    [onDataChange]
  );

  const handleAbiDialogOpen = useCallback(() => {
    const newResource: Resource = {
      name: `${name} ABI`,
      type: ResourceType.Abi,
      data: {
        abi: {
          ...RESOURCE_DATA_TEMPLATES.abi,
          abi: fetchedAbi,
        },
      },
      // These values are all generated on the BE, but we provide placeholder values until the
      // object is created.
      _id: '',
      createdAt: '',
      updatedAt: '',
    };
    dispatch(
      pushResource({
        type: 'create',
        resource: newResource,
      })
    );
  }, [dispatch, fetchedAbi, name]);

  return (
    <FormContainer testId="smart-contract-form">
      <TextField
        label="Name"
        placeholder="Enter contract name"
        value={name}
        onChange={handleNameChange}
        required
      />
      <Select
        value={data?.chainId}
        placeholder="Select contract network"
        label="Network"
        onChange={handleNetworkChange}
        required
        inputProps={{
          'data-testid': 'smart-contract-form-network-select',
        }}
      >
        {CHAINS.map((chain) => (
          <MenuItem key={chain.id} value={chain.id}>
            {chain.name}
          </MenuItem>
        ))}
      </Select>
      <AddressTextField
        value={data?.address}
        label="Address"
        placeholder="Enter contract address"
        onChange={handleAddressChange}
        required
      />
      <Select
        value={data?.abiId}
        placeholder={abis.length === 0 ? 'No created ABIs' : 'Select contract ABI'}
        disabled={abis.length === 0}
        label="ABI"
        onChange={handleAbiChange}
        required
        inputProps={{
          'data-testid': 'smart-contract-form-abi-select',
        }}
      >
        {abis.map((abi) => (
          <MenuItem key={abi._id} value={abi._id}>
            {abi.name}
          </MenuItem>
        ))}
      </Select>
      <Button variant="text" onClick={handleAbiDialogOpen} sx={{ alignSelf: 'flex-start' }}>
        Create new ABI
      </Button>
    </FormContainer>
  );
};
