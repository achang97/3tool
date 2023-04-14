import { Select, SelectProps } from '@app/components/common/Select';
import { Box, MenuItem } from '@mui/material';
import { ChangeEvent, useCallback } from 'react';

type InspectorSelectProps = Omit<SelectProps, 'onChange'> & {
  onChange: (newValue: any) => void;
  options: {
    label: string;
    value: any;
  }[];
  testId?: string;
};

export const InspectorSelect = ({
  options,
  onChange,
  label,
  testId,
  ...rest
}: InspectorSelectProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Box data-testid={testId ?? `inspector-select-${label}`} sx={{ flex: 1 }}>
      <Select {...rest} label={label} onChange={handleChange} fullWidth size="small">
        {options.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
