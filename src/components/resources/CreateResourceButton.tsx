import { useState, useCallback } from 'react';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { CreateResourceDialog } from './CreateResourceDialog';

export const CreateResourceButton = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateDialogOpen = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCreateDialogClose = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  return (
    <>
      <Button
        variant="text"
        startIcon={<Add color="primary" />}
        onClick={handleCreateDialogOpen}
      >
        Add new resource
      </Button>
      <CreateResourceDialog
        open={isCreateDialogOpen}
        onClose={handleCreateDialogClose}
      />
    </>
  );
};
