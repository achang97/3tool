import { TextField, TextFieldProps } from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';

type AddressTextFieldProps = Omit<TextFieldProps, 'value'> & {
  value: string;
  fetchAbiError?: string;
};

export const AddressTextField = ({
  value,
  fetchAbiError,
  ...rest
}: AddressTextFieldProps) => {
  const errorMessage = useMemo(() => {
    if (value && !isAddress(value)) {
      return 'Invalid address';
    }

    if (fetchAbiError) {
      return fetchAbiError;
    }

    return '';
  }, [value, fetchAbiError]);

  return (
    <TextField
      value={value}
      error={!!errorMessage}
      helperText={errorMessage}
      {...rest}
    />
  );
};
