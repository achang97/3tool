import { useAppSelector } from '@app/redux/hooks';
import { Box, Divider } from '@mui/material';
import { ActionEditor } from './actions/ActionEditor';
import { ActionList } from './actions/ActionList';
import { EmptyPlaceholder } from './actions/common/EmptyPlaceholder';

const HEIGHT = '250px';
const LIST_WIDTH = '260px';

export const EditorActions = () => {
  const { focusedAction } = useAppSelector((state) => state.editor);

  return (
    <Box
      sx={{
        height: HEIGHT,
        display: 'flex',
        boxShadow: 3,
        flexShrink: 0,
        // NOTE: Removes the overlapping shadow on the right side of the container.
        clipPath: 'inset(-5px 0px -5px -5px)',
      }}
    >
      <Box sx={{ width: LIST_WIDTH }}>
        <ActionList />
      </Box>
      <Divider orientation="vertical" />
      <Box sx={{ flex: 1 }}>
        {focusedAction ? (
          <ActionEditor action={focusedAction} />
        ) : (
          <Box sx={{ padding: 2, height: '100%' }}>
            <EmptyPlaceholder>Select an action to edit</EmptyPlaceholder>
          </Box>
        )}
      </Box>
    </Box>
  );
};
