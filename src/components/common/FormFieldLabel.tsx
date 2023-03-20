import { Help } from '@mui/icons-material';
import { Box, BoxProps, InputLabel, Tooltip } from '@mui/material';

export type FormFieldLabelProps = {
  label: string;
  tooltip?: string;
  sx?: BoxProps['sx'];
};

export const FormFieldLabel = ({ label, tooltip, sx }: FormFieldLabelProps) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        ...sx,
      }}
    >
      <InputLabel shrink>{label}</InputLabel>
      {tooltip && (
        <Tooltip
          title={tooltip}
          sx={{
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: 'greyscale.icon.dark',
          }}
        >
          <Help data-testid="form-field-label-help" fontSize="inherit" />
        </Tooltip>
      )}
    </Box>
  );
};
