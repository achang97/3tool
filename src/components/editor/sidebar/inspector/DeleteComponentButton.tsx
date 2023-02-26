import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { DeleteDialog } from '../../common/DeleteDialog';
import { useComponentDelete } from '../../hooks/useComponentDelete';

type DeleteComponentButtonProps = {
  name: string;
};

export const DeleteComponentButton = ({ name }: DeleteComponentButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteComponent = useComponentDelete(name);

  const handleDialogOpen = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return (
    <>
      <Button color="error" startIcon={<Delete />} onClick={handleDialogOpen}>
        Delete
      </Button>
      <DeleteDialog
        name={name}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onDelete={handleDeleteComponent}
      />
    </>
  );
};
