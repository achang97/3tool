import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useElementDependentFields } from '../hooks/useElementDependentFields';

type DeleteDialogProps = {
  name: string;
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<boolean>;
};

export const DeleteDialog = ({
  name,
  open,
  onClose,
  onDelete,
}: DeleteDialogProps) => {
  const dependents = useElementDependentFields(name);

  const handleConfirmDelete = useCallback(async () => {
    const isSuccessful = await onDelete();
    if (!isSuccessful) {
      return;
    }
    onClose();
  }, [onClose, onDelete]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth data-testid="delete-dialog">
      <DialogTitle>Are you sure you want to delete {name}?</DialogTitle>
      {dependents.length !== 0 && (
        <DialogContent data-testid="delete-dialog-content">
          <Typography sx={{ display: 'inline' }}>
            You will need to manually delete the following JavaScript expression
            references:{' '}
          </Typography>
          <Typography sx={{ display: 'inline', marginLeft: 0.5 }}>
            {dependents.map((dependent, i) => (
              <Typography
                key={dependent}
                component="span"
                sx={{ display: 'inline', marginRight: 0.5 }}
              >
                <code>{dependent}</code>
                {i !== dependents.length - 1 ? ', ' : ''}
              </Typography>
            ))}
          </Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button color="error" onClick={handleConfirmDelete}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
