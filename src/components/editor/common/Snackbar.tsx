import { Alert, AlertColor } from '@mui/material';
import { SnackbarContent } from 'notistack';
import { forwardRef, Ref } from 'react';

export type SnackbarProps = {
  message: string;
  variant: AlertColor;
};

export const Snackbar = forwardRef(
  ({ message, variant }: SnackbarProps, ref: Ref<HTMLDivElement>) => {
    return (
      <SnackbarContent ref={ref}>
        <Alert severity={variant} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </SnackbarContent>
    );
  }
);
