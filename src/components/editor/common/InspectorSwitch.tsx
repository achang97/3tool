import { FormControlLabel, Switch } from '@mui/material';
import { ChangeEvent, ReactNode, useCallback } from 'react';

type InspectorSwitchProps = {
  label?: ReactNode;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  testId?: string;
};

export const InspectorSwitch = ({ onChange, label, checked, testId }: InspectorSwitchProps) => {
  const handleCheckedChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange]
  );

  return (
    <FormControlLabel
      data-testid={testId ?? `inspector-switch-${label}`}
      componentsProps={{ typography: { variant: 'body2' } }}
      sx={{ marginX: 0, marginY: 0.5 }}
      control={<Switch checked={checked} onChange={handleCheckedChange} size="small" />}
      label={label}
    />
  );
};
