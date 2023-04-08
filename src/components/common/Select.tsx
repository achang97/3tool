import { TextField, TextFieldProps, useTheme } from '@mui/material';
import { useMemo } from 'react';

export type SelectProps = TextFieldProps;

export const Select = ({
  placeholder,
  value,
  SelectProps,
  ...rest
}: SelectProps) => {
  const theme = useTheme();

  const renderValue = useMemo(() => {
    if (value) {
      return undefined;
    }

    return () => (
      <span
        style={{
          opacity: theme.opacity.inputPlaceholder,
        }}
      >
        {placeholder}
      </span>
    );
  }, [placeholder, theme.opacity.inputPlaceholder, value]);

  return (
    <TextField
      inputProps={{
        'data-testid': 'select',
      }}
      value={value}
      select
      SelectProps={{
        ...SelectProps,
        renderValue,
        displayEmpty: !!placeholder,
      }}
      {...rest}
    />
  );
};
