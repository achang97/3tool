import { ApiError } from '@app/types';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import _ from 'lodash';
import { ChangeEvent, FormEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { ApiErrorMessage } from '../common/ApiErrorMessage';

const Bold = styled('b')(() => ({
  fontWeight: 700,
}));

export type BaseDeleteDialogProps = {
  entityName: string;
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: ApiError | SerializedError | undefined;
  onDelete: () => Promise<void>;
  showConfirmation: boolean;
  customBody?: ReactNode;
  testId?: string;
};

export const BaseDeleteDialog = ({
  entityName,
  entityType,
  isOpen,
  onClose,
  isLoading,
  error,
  onDelete,
  showConfirmation,
  customBody,
  testId,
}: BaseDeleteDialogProps) => {
  const [confirmationName, setConfirmationName] = useState('');

  const handleConfirmationNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setConfirmationName(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        await onDelete();
        onClose();
      } catch {
        // Do nothing
      }
    },
    [onDelete, onClose]
  );

  const isEntityNameMatch = useMemo(() => {
    return !confirmationName || confirmationName === entityName;
  }, [entityName, confirmationName]);

  const isSaveDisabled = useMemo(() => {
    return showConfirmation && (!confirmationName || !isEntityNameMatch);
  }, [isEntityNameMatch, showConfirmation, confirmationName]);

  return (
    <Dialog onClose={onClose} open={isOpen} maxWidth="xs" data-testid={testId}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Delete {entityType}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Are you sure you want to permanently delete this {entityType}?</Typography>

            {customBody ?? (
              <Typography>
                Once <Bold>{entityName}</Bold> is deleted, you will not be able to recover its
                information.
              </Typography>
            )}

            {showConfirmation && (
              <TextField
                variant="outlined"
                autoComplete="off"
                label={`Type the name of the ${entityType} to confirm deletion`}
                placeholder={`Enter the name of the ${entityType}`}
                value={confirmationName}
                onChange={handleConfirmationNameChange}
                fullWidth
                error={!isEntityNameMatch}
                helperText={!isEntityNameMatch && `${_.capitalize(entityType)} name is not correct`}
              />
            )}
            {error && <ApiErrorMessage error={error} />}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" color="secondary" onClick={onClose}>
            No, cancel
          </Button>
          <LoadingButton type="submit" color="error" loading={isLoading} disabled={isSaveDisabled}>
            Yes, delete it.
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
