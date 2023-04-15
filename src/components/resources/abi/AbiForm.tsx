import { ChangeEvent, useCallback } from 'react';
import { Checkbox, Collapse, FormControlLabel, Stack, TextField } from '@mui/material';
import { ResourceType } from '@app/types';
import { BaseResourceFormProps } from '@app/types/resources';
import { AbiTextField } from './AbiTextField';

export const AbiForm = ({
  name,
  data,
  onDataChange,
  onNameChange,
}: BaseResourceFormProps<ResourceType.Abi>) => {
  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onNameChange(e.target.value);
    },
    [onNameChange]
  );

  const handleIsProxyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onDataChange({ isProxy: e.target.checked });
    },
    [onDataChange]
  );

  const handleAbiChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onDataChange({ abi: e.target.value });
    },
    [onDataChange]
  );

  const handleLogicAbiChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onDataChange({ logicAbi: e.target.value });
    },
    [onDataChange]
  );

  return (
    <Stack spacing={1} data-testid="abi-form">
      <TextField
        label="Name"
        placeholder="Enter ABI name"
        value={name}
        onChange={handleNameChange}
        required
      />
      <AbiTextField
        label="ABI"
        value={data?.abi}
        placeholder="Enter contract ABI"
        onChange={handleAbiChange}
        required
      />
      <FormControlLabel
        control={<Checkbox checked={data?.isProxy} onChange={handleIsProxyChange} />}
        label="Add logic ABI"
        componentsProps={{ typography: { variant: 'body2' } }}
      />
      <Collapse in={data?.isProxy}>
        <AbiTextField
          label="Logic ABI"
          value={data?.logicAbi}
          placeholder="Enter logic contract ABI"
          onChange={handleLogicAbiChange}
          required={data?.isProxy}
          fullWidth
        />
      </Collapse>
    </Stack>
  );
};
