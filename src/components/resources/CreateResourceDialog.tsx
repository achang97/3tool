import { Dialog, DialogContent, DialogTitle } from '@mui/material';

type CreateResourceDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const CreateResourceDialog = ({
  onClose,
  open,
}: CreateResourceDialogProps) => {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      data-testid="create-resource-dialog"
    >
      <DialogTitle>Create Resource</DialogTitle>
      <DialogContent>New Resource</DialogContent>
    </Dialog>
  );
};
