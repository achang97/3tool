import { Help } from '@mui/icons-material';
import { Box, InputLabel, Tooltip } from '@mui/material';

export type FormFieldLabelProps = {
  label: string;
  tooltip?: string;
};

export const FormFieldLabel = ({ label, tooltip }: FormFieldLabelProps) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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
