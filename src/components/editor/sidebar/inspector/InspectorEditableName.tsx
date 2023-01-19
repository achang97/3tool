import {
  EditableTextField,
  EditableTextFieldProps,
} from '@app/components/common/EditableTextField';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type InspectorEditableNameProps = {
  icon: ReactNode;
  subtitle?: string;
} & Pick<EditableTextFieldProps, 'value' | 'onSubmit' | 'editable'>;

export const InspectorEditableName = ({
  value,
  onSubmit,
  editable,
  icon,
  subtitle,
}: InspectorEditableNameProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 1.5,
        paddingY: 1,
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '35px' }}
      >
        {icon}
        <EditableTextField
          value={value}
          onSubmit={onSubmit}
          editable={editable}
          TypographyProps={{ variant: 'body2' }}
          TextFieldProps={{ size: 'small' }}
        />
      </Box>
      {subtitle && (
        <Typography
          variant="caption"
          sx={{ whiteSpace: 'nowrap', marginLeft: 0.5 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
