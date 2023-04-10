import { Select, SelectProps } from '@app/components/common/Select';
import { Box, MenuItem } from '@mui/material';
import { ChangeEvent, useCallback } from 'react';

type InspectorSelectProps = Omit<SelectProps, 'onChange'> & {
  onChange: (newValue: any) => void;
  options: {
    label: string;
    value: any;
  }[];
};

export const InspectorSelect = ({ options, onChange, label, ...rest }: InspectorSelectProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Box
      data-testid={`inspector-select-${label}`}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Select {...rest} label={label} onChange={handleChange} size="small">
        {options.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
