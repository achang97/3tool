import { FormFieldLabel } from '@app/components/common/FormFieldLabel';
import { FormControlLabel, Switch } from '@mui/material';
import { ChangeEvent, FC, ReactNode, useCallback, useMemo } from 'react';
import { FieldType } from '@app/types';
import { InspectorTextField } from './InspectorTextField';

type ToggleableInspectorFieldProps = {
  label: string;
  value: any;
  onChange: (newValue: any) => void;
  tooltip?: string;
  dynamicType: FieldType;
  isDynamic?: boolean;
  onIsDynamicToggle: (isDynamic: boolean) => void;
  children: FC<{
    label?: ReactNode;
    value?: any;
    onChange: (newValue: any) => void;
    testId?: string;
  }>;
  testId?: string;
};

export const ToggleableInspectorField = ({
  label,
  value,
  dynamicType,
  onChange,
  tooltip,
  isDynamic,
  onIsDynamicToggle,
  children,
  testId,
}: ToggleableInspectorFieldProps) => {
  const handleIsDynamicChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onIsDynamicToggle(e.target.checked);
    },
    [onIsDynamicToggle]
  );

  const labelElement = useMemo(() => {
    return (
      <FormFieldLabel
        label={label}
        tooltip={tooltip}
        endAdornment={
          <FormControlLabel
            componentsProps={{ typography: { variant: 'caption' } }}
            sx={{ marginX: 0 }}
            control={<Switch checked={isDynamic} onChange={handleIsDynamicChange} size="small" />}
            label="Get via JavaScript"
          />
        }
      />
    );
  }, [label, tooltip, isDynamic, handleIsDynamicChange]);

  if (!isDynamic) {
    return children({ label: labelElement, value, onChange, testId });
  }

  return (
    <InspectorTextField
      type={dynamicType}
      label={labelElement}
      value={value}
      onChange={onChange}
      testId={testId}
    />
  );
};
