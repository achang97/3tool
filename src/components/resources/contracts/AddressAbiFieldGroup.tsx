import { isJSON } from '@app/utils/string';
import { Collapse, TextField } from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { ChangeEvent, useCallback, useMemo } from 'react';
import { useFetchAbi } from '../hooks/useFetchAbi';

export type GroupTextFieldProps = {
  label: string;
  placeholder: string;
  onChange: (newValue: string) => void;
};

type AddressAbiFieldGroupProps = {
  abi: string;
  address: string;
  chainId: number;
  required?: boolean;
  addressTextFieldProps: GroupTextFieldProps;
  abiTextFieldProps: GroupTextFieldProps;
};
export const AddressAbiFieldGroup = ({
  abi,
  address,
  chainId,
  required,
  addressTextFieldProps,
  abiTextFieldProps,
}: AddressAbiFieldGroupProps) => {
  const { error: fetchAbiError, isLoading: isLoadingAbi } = useFetchAbi({
    abi,
    address,
    chainId,
    onAbiChange: abiTextFieldProps.onChange,
  });

  const isAbiShown = useMemo(
    () => isAddress(address) && !fetchAbiError && !isLoadingAbi,
    [address, fetchAbiError, isLoadingAbi]
  );

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      addressTextFieldProps.onChange(e.target.value);
      abiTextFieldProps.onChange('');
    },
    [abiTextFieldProps, addressTextFieldProps]
  );

  const handleAbiChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      abiTextFieldProps.onChange(e.target.value);
    },
    [abiTextFieldProps]
  );

  const addressErrorMessage = useMemo(() => {
    if (address && !isAddress(address)) {
      return 'Invalid address';
    }

    if (fetchAbiError) {
      return fetchAbiError.message;
    }

    return '';
  }, [address, fetchAbiError]);

  const abiErrorMessage = useMemo(() => {
    if (abi && !isJSON(abi)) {
      return 'Invalid JSON';
    }

    return '';
  }, [abi]);

  return (
    <>
      <TextField
        value={address}
        placeholder={addressTextFieldProps.placeholder}
        label={addressTextFieldProps.label}
        onChange={handleAddressChange}
        error={!!addressErrorMessage}
        helperText={addressErrorMessage}
        required={required}
        inputProps={{
          'data-testid': 'address-text-field',
        }}
      />
      <Collapse in={isAbiShown}>
        <TextField
          value={abi}
          placeholder={abiTextFieldProps.placeholder}
          label={abiTextFieldProps.label}
          onChange={handleAbiChange}
          error={!!abiErrorMessage}
          helperText={abiErrorMessage}
          fullWidth
          multiline
          minRows={10}
          maxRows={10}
          required={required}
          inputProps={{
            'data-testid': 'abi-text-field',
            style: {
              fontFamily: 'monospace',
            },
          }}
        />
      </Collapse>
    </>
  );
};
