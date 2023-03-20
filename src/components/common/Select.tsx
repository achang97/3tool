import { theme } from '@app/utils/mui';
import { TextField, TextFieldProps } from '@mui/material';
import { useMemo } from 'react';

export type SelectProps = TextFieldProps;

export const Select = ({
  placeholder,
  value,
  SelectProps,
  ...rest
}: SelectProps) => {
  const renderValue = useMemo(() => {
    if (value) {
      return undefined;
    }

    return () => (
      <span
        style={{ opacity: theme.colorSchemes.light.opacity.inputPlaceholder }}
      >
        {placeholder}
      </span>
    );
  }, [placeholder, value]);

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
