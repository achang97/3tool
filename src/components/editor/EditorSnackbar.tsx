import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { Alert, Snackbar } from '@mui/material';
import { useCallback } from 'react';

export const DURATION_MS = 3000;

export const EditorSnackbar = () => {
  const { snackbarMessage } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(setSnackbarMessage(undefined));
  }, [dispatch]);

  if (!snackbarMessage) {
    return null;
  }

  return (
    <Snackbar
      open={!!snackbarMessage}
      autoHideDuration={DURATION_MS}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ marginTop: 7 }}
      data-testid="editor-snackbar"
    >
      <Alert
        onClose={handleClose}
        severity={snackbarMessage?.type}
        sx={{ width: '100%' }}
      >
        {snackbarMessage?.message}
      </Alert>
    </Snackbar>
  );
};
