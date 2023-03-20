import { FormControlLabel, Switch } from '@mui/material';
import { ChangeEvent } from 'react';

type InspectorSwitchProps = {
  label?: string;
  checked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export const InspectorSwitch = ({
  onChange,
  label,
  checked,
}: InspectorSwitchProps) => {
  return (
    <FormControlLabel
      data-testid={`inspector-switch-${label}`}
      componentsProps={{ typography: { variant: 'body2' } }}
      sx={{ marginX: 0, marginY: 0.5 }}
      control={<Switch checked={checked} onChange={onChange} size="small" />}
      label={label}
    />
  );
};
