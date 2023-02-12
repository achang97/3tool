import { FormFieldLabel } from '@app/components/common/FormFieldLabel';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useCallback, MouseEvent } from 'react';

export type InspectorEnumFieldProps = {
  label: string;
  value?: any;
  options: {
    label: string;
    value: any;
  }[];
  onChange: (newValue: string) => void;
};

export const InspectorEnumField = ({
  label,
  value,
  options,
  onChange,
}: InspectorEnumFieldProps) => {
  const handleChange = useCallback(
    (e: MouseEvent<HTMLElement>, newValue: string | null) => {
      if (!newValue) {
        return;
      }

      onChange(newValue);
    },
    [onChange]
  );

  return (
    <Box data-testid={`inspector-enum-field-${label}`}>
      <FormFieldLabel label={label} />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value}
        fullWidth
        onChange={handleChange}
        sx={{ marginTop: 1 }}
      >
        {options.map((option) => (
          <ToggleButton key={option.label} value={option.value} sx={{ py: 0 }}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
