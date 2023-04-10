import { Alert, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type CodeMirrorPreviewProps = {
  alertType: 'success' | 'error';
  type?: string;
  message: ReactNode;
};

export const CodeMirrorPreview = ({ alertType, type, message }: CodeMirrorPreviewProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1,
      }}
      data-testid="code-mirror-preview"
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
