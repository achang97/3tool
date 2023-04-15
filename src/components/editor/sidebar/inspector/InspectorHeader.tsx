import {
  EditableTextField,
  EditableTextFieldProps,
} from '@app/components/common/EditableTextField';
import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type InspectorHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  isEditable: boolean;
} & Pick<EditableTextFieldProps, 'onSubmit'>;

export const InspectorHeader = ({
  title,
  onSubmit,
  isEditable,
  icon,
  subtitle,
}: InspectorHeaderProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 1.5,
        paddingY: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: 1, minWidth: 0 }}>
        {icon}
        <EditableTextField
          value={title}
          onSubmit={onSubmit}
          isEditable={isEditable}
          showIcon={isEditable}
          TypographyProps={{ variant: 'body2' }}
          TextFieldProps={{ size: 'small' }}
          height={35}
        />
      </Stack>
      {subtitle && (
        <Typography variant="caption" sx={{ whiteSpace: 'nowrap', marginLeft: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};
