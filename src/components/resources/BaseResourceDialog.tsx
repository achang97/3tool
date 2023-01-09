import { ApiError, Resource } from '@app/types';
import { parseApiError } from '@app/utils/api';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ConfigureResourceForm } from './ConfigureResourceForm';

type BaseResourceDialogProps = {
  title: string;
  open: boolean;
  onSubmit: (resource: Pick<Resource, 'type' | 'name' | 'metadata'>) => void;
  onClose: () => void;
  error?: ApiError | SerializedError;
  isLoading?: boolean;
  testId?: string;
};

const FORM_ID = 'resource-form';

export const BaseResourceDialog = ({
  title,
  open,
  onSubmit,
  onClose,
  error,
  isLoading,
  testId,
}: BaseResourceDialogProps) => {
  const errorRef = useRef<HTMLSpanElement>(null);

  const handleSubmit = useCallback(
    (resource: Pick<Resource, 'type' | 'name' | 'metadata'>) => {
      onSubmit(resource);
    },
    [onSubmit]
  );

  const errorMessage = useMemo(() => {
    return error && parseApiError(error);
  }, [error]);

  useEffect(() => {
    if (errorMessage) {
      errorRef.current?.scrollIntoView();
    }
  }, [errorMessage]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth data-testid={testId}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ConfigureResourceForm formId={FORM_ID} onSubmit={handleSubmit} />
        {errorMessage && (
          <Typography
            ref={errorRef}
            color="error"
            variant="body2"
            sx={{ marginTop: 1, textAlign: 'center' }}
          >
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <LoadingButton form={FORM_ID} type="submit" loading={isLoading}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
