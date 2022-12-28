import { useCallback, useState } from 'react';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { CreateToolDialog } from './CreateToolDialog';
import { ThumbnailContainer } from './ThumbnailContainer';

export const CreateToolThumbnail = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return (
    <>
      <ThumbnailContainer
        icon={<Add fontSize="inherit" color="primary" />}
        onClick={handleDialogOpen}
      >
        <Button
          startIcon={<Add fontSize="inherit" />}
          variant="contained"
          fullWidth
        >
          New tool
        </Button>
      </ThumbnailContainer>
      <CreateToolDialog open={isDialogOpen} onClose={handleDialogClose} />
    </>
  );
};
