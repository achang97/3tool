import { Help } from '@mui/icons-material';
import { Box, FormLabel, Tooltip } from '@mui/material';

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
      <FormLabel>{label}</FormLabel>
      {tooltip && (
        <Tooltip title={tooltip} sx={{ cursor: 'pointer' }}>
          <Help data-testid="form-field-label-help" />
        </Tooltip>
      )}
    </Box>
  );
};
