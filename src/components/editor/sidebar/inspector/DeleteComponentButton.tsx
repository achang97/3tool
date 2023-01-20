import { blurComponentFocus } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { Delete } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useGetActiveTool } from '../../hooks/useGetActiveTool';
import { useUpdateActiveTool } from '../../hooks/useUpdateActiveTool';

type DeleteComponentButtonProps = {
  name: string;
};

export const DeleteComponentButton = ({ name }: DeleteComponentButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tool = useGetActiveTool();
  const updateTool = useUpdateActiveTool();

  const dispatch = useAppDispatch();

  const handleDialogOpen = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleDeleteComponent = useCallback(async () => {
    const response = await updateTool({
      components: tool?.components.filter(
        (currComponent) => currComponent.name !== name
      ),
    });
    handleDialogClose();

    if (!isSuccessfulApiResponse(response)) {
      return;
    }

    dispatch(blurComponentFocus());
  }, [dispatch, name, tool, updateTool, handleDialogClose]);

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
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete {name}?</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDeleteComponent}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
