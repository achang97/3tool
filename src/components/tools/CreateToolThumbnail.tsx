import { Button, Icon } from '@mui/material';
import { useCallback, useState } from 'react';
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
      <ThumbnailContainer onClick={handleDialogOpen}>
        <Icon fontSize="large" color="primary" sx={{ marginBottom: 1 }}>
          add
        </Icon>
        <Button variant="contained">Start a new project</Button>
      </ThumbnailContainer>
      <CreateToolDialog open={isDialogOpen} onClose={handleDialogClose} />
    </>
  );
};
