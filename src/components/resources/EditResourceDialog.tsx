import { Dialog, DialogContent, DialogTitle } from '@mui/material';

type EditResourceDialogProps = {
  onClose: () => void;
  open: boolean;
  resourceId?: string;
};

export const EditResourceDialog = ({
  onClose,
  open,
  resourceId,
}: EditResourceDialogProps) => {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      data-testid="edit-resource-dialog"
    >
      <DialogTitle>Edit Resource</DialogTitle>
      <DialogContent>{resourceId}</DialogContent>
    </Dialog>
  );
};
