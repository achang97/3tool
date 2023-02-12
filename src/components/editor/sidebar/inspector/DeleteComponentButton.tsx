import { Delete } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useComponentDataDependents } from '../../hooks/useComponentDataDependents';
import { useDeleteComponent } from '../../hooks/useDeleteComponent';

type DeleteComponentButtonProps = {
  name: string;
};

export const DeleteComponentButton = ({ name }: DeleteComponentButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteComponent = useDeleteComponent(name);
  const dependents = useComponentDataDependents(name);

  const handleDialogOpen = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const result = await handleDeleteComponent();

    if (!result) {
      return;
    }
    handleDialogClose();
  }, [handleDeleteComponent, handleDialogClose]);

  return (
    <>
      <Button color="error" startIcon={<Delete />} onClick={handleDialogOpen}>
        Delete
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        data-testid="delete-component-button-dialog"
      >
        <DialogTitle>Are you sure you want to delete {name}?</DialogTitle>
        {dependents.length !== 0 && (
          <DialogContent>
            <Typography>
              You will need to manually delete the following JavaScript
              expression references: {dependents.join(', ')}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button variant="outlined" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
