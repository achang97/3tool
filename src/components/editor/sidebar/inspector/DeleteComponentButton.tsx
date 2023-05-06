import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { setComponentToDelete } from '@app/redux/features/editorSlice';
// import { useKeyPress } from '@app/hooks/useKeyPress';
import { DeleteDialog } from '../../common/DeleteDialog';
import { useComponentDelete } from '../../hooks/useComponentDelete';

type DeleteComponentButtonProps = {
  name: string;
};

export const DeleteComponentButton = ({ name }: DeleteComponentButtonProps) => {
  const { deletingComponentName } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const handleDeleteComponent = useComponentDelete(name);

  const handleDialogOpen = useCallback(() => {
    dispatch(setComponentToDelete(name));
  }, [dispatch, name]);

  const handleDialogClose = useCallback(() => {
    dispatch(setComponentToDelete(undefined));
  }, [dispatch]);

  // useKeyPress({ key: 'Backspace', onPress: handleDialogOpen });

  return (
    <>
      <Button color="error" endIcon="⌫" onClick={handleDialogOpen}>
        Delete
      </Button>
      <DeleteDialog
        name={name}
        isOpen={!!deletingComponentName}
        onClose={handleDialogClose}
        onDelete={handleDeleteComponent}
      />
    </>
  );
};
