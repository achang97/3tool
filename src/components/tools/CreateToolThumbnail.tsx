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
        testId="create-tool-thumbnail"
      >
        <Button startIcon={<Add fontSize="inherit" />} fullWidth>
          New app
        </Button>
      </ThumbnailContainer>
      <CreateToolDialog isOpen={isDialogOpen} onClose={handleDialogClose} />
    </>
  );
};
