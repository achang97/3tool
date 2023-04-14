import { Box, BoxProps, InputLabel, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';
import { HelpTooltip } from './HelpTooltip';

export type FormFieldLabelProps = {
  label: TextFieldProps['label'];
  tooltip?: string;
  endAdornment?: ReactNode;
  sx?: BoxProps['sx'];
};

export const FormFieldLabel = ({ label, tooltip, endAdornment, sx }: FormFieldLabelProps) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
        marginBottom: 0.25,
        ...sx,
      }}
    >
      <InputLabel shrink sx={{ flex: 1 }}>
        {label}
      </InputLabel>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {endAdornment}
        {tooltip && <HelpTooltip text={tooltip} />}
      </Box>
    </Box>
  );
};
