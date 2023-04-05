import { TextField, TextFieldProps } from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';

type AddressTextFieldProps = TextFieldProps & {
  value?: string;
};

export const AddressTextField = ({ value, ...rest }: AddressTextFieldProps) => {
  const errorMessage = useMemo(() => {
    if (value && !isAddress(value)) {
      return 'Invalid address';
    }

    return '';
  }, [value]);

  return (
    <TextField
      value={value}
      error={!!errorMessage}
      helperText={errorMessage}
      inputProps={{
        'data-testid': 'address-text-field',
      }}
      {...rest}
    />
  );
};
