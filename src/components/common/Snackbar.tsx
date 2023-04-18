import { Close } from '@mui/icons-material';
import { Alert, AlertColor, IconButton, Stack } from '@mui/material';
import { SnackbarContent } from 'notistack';
import { forwardRef, ReactNode, Ref } from 'react';

export type SnackbarProps = {
  message: ReactNode;
  variant: AlertColor;
  action?: ReactNode;
  persist?: boolean;
  onClose: () => void;
};

export const Snackbar = forwardRef(
  ({ message, variant, persist, action, onClose }: SnackbarProps, ref: Ref<HTMLDivElement>) => {
    return (
      <SnackbarContent ref={ref}>
        <Alert
          sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}
          action={
            <Stack direction="row">
              {action}
              {persist && (
                <IconButton size="small" onClick={onClose} data-testid="snackbar-close-button">
                  <Close fontSize="inherit" />
                </IconButton>
              )}
            </Stack>
          }
          severity={variant}
        >
          {message}
        </Alert>
      </SnackbarContent>
    );
  }
);
