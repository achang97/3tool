import { isJSON } from '@app/utils/string';
import { TextField, TextFieldProps } from '@mui/material';
import { useMemo } from 'react';

type AbiTextFieldProps = TextFieldProps & {
  value?: string;
};

export const AbiTextField = ({ value, ...rest }: AbiTextFieldProps) => {
  const errorMessage = useMemo(() => {
    if (value && !isJSON(value)) {
      return 'Invalid JSON';
    }

    return '';
  }, [value]);

  return (
    <TextField
      value={value}
      error={!!errorMessage}
      helperText={errorMessage}
      inputProps={{
        'data-testid': 'abi-text-field',
        style: {
          fontFamily: 'monospace',
        },
      }}
      fullWidth
      multiline
      minRows={10}
      maxRows={10}
      {...rest}
    />
  );
};
