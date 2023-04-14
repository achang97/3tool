import { FormFieldLabel } from '@app/components/common/FormFieldLabel';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useCallback, MouseEvent, ReactNode } from 'react';

type InspectorEnumFieldProps = {
  label?: ReactNode;
  value?: any;
  options: {
    label: string;
    value: any;
  }[];
  onChange: (newValue: any) => void;
  testId?: string;
};

export const InspectorEnumField = ({
  label,
  value,
  options,
  onChange,
  testId,
}: InspectorEnumFieldProps) => {
  const handleChange = useCallback(
    (e: MouseEvent<HTMLElement>, newValue: any) => {
      if (newValue === null) {
        return;
      }
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <Box data-testid={testId ?? `inspector-enum-${label}`}>
      {label && <FormFieldLabel label={label} />}
      <ToggleButtonGroup exclusive size="small" value={value} fullWidth onChange={handleChange}>
        {options.map((option) => (
          <ToggleButton key={option.label} value={option.value} sx={{ py: 0.5 }}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
