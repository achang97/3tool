import { ApiError, Resource } from '@app/types';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { useCallback, useEffect, useRef } from 'react';
import { ConfigureResourceForm } from './ConfigureResourceForm';
import { ApiErrorMessage } from '../common/ApiErrorMessage';

type BaseResourceDialogProps = {
  title: string;
  isOpen: boolean;
  onSubmit: (resource: Pick<Resource, 'type' | 'name' | 'data'>) => void;
  onClose: () => void;
  error?: ApiError | SerializedError;
  isLoading?: boolean;
  testId?: string;
};

const FORM_ID = 'resource-form';

export const BaseResourceDialog = ({
  title,
  isOpen,
  onSubmit,
  onClose,
  error,
  isLoading,
  testId,
}: BaseResourceDialogProps) => {
  const errorRef = useRef<HTMLSpanElement>(null);

  const handleSubmit = useCallback(
    (resource: Pick<Resource, 'type' | 'name' | 'data'>) => {
      onSubmit(resource);
    },
    [onSubmit]
  );

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView();
    }
  }, [error]);

  return (
    <Dialog onClose={onClose} open={isOpen} fullWidth data-testid={testId}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ConfigureResourceForm formId={FORM_ID} onSubmit={handleSubmit} />
        {error && <ApiErrorMessage error={error} ref={errorRef} />}
      </DialogContent>
      <DialogActions>
        <LoadingButton form={FORM_ID} type="submit" loading={isLoading}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
