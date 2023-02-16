import { useAppSelector } from '@app/redux/hooks';
import { Box, Typography } from '@mui/material';
import { EmptyPlaceholder } from './common/EmptyPlaceholder';

export const ActionEditor = () => {
  const { focusedActionName } = useAppSelector((state) => state.editor);

  return (
    <Box data-testid="action-editor" sx={{ padding: 2, flex: 1 }}>
      {focusedActionName ? (
        <Typography>{focusedActionName}</Typography>
      ) : (
        <EmptyPlaceholder>Select an action to edit</EmptyPlaceholder>
      )}
    </Box>
  );
};
