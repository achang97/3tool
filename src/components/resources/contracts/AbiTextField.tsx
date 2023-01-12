import { isJSON } from '@app/utils/string';
import { TextField, TextFieldProps } from '@mui/material';
import { useMemo } from 'react';

type AbiTextFieldProps = Omit<TextFieldProps, 'value'> & {
  value: string;
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
      multiline
      value={value}
      error={!!errorMessage}
      helperText={errorMessage}
      minRows={10}
      maxRows={10}
      InputProps={{
        style: {
          fontFamily: 'monospace',
        },
      }}
      {...rest}
    />
  );
};
