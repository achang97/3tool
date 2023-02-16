import {
  EditableTextField,
  EditableTextFieldProps,
} from '@app/components/common/EditableTextField';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type InspectorEditableNameProps = {
  icon: ReactNode;
  subtitle?: string;
} & Pick<EditableTextFieldProps, 'value' | 'onSubmit' | 'isEditable'>;

export const InspectorEditableName = ({
  value,
  onSubmit,
  isEditable,
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
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flex: 1,
          minWidth: 0,
        }}
      >
        {icon}
        <EditableTextField
          value={value}
          onSubmit={onSubmit}
          isEditable={isEditable}
          TypographyProps={{ variant: 'body2' }}
          TextFieldProps={{ size: 'small' }}
          height={35}
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
