import { Alert, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type DynamicTextFieldPreviewProps = {
  alertType: 'success' | 'error';
  type?: string;
  message: ReactNode;
};

export const DynamicTextFieldPreview = ({
  alertType,
  type,
  message,
}: DynamicTextFieldPreviewProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1,
      }}
      data-testid="dynamic-test-field-preview"
    >
      <Alert
        color={alertType}
        icon={false}
        sx={{
          paddingY: 0,
          paddingX: 1.5,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          whiteSpace: 'break-spaces',
        }}
      >
        <Typography variant="caption">{type}</Typography>
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Box>
  );
};
