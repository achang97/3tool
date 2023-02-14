import { Box, Divider } from '@mui/material';
import { ActionEditor } from './actions/ActionEditor';
import { ActionList } from './actions/ActionList';

const HEIGHT = '250px';
const LIST_WIDTH = '260px';

export const EditorActions = () => {
  return (
    <Box
      sx={{
        height: HEIGHT,
        display: 'flex',
        boxShadow: 3,
        // NOTE: Removes the overlapping shadow on the right side of the container.
        clipPath: 'inset(-5px 0px -5px -5px)',
      }}
    >
      <Box sx={{ width: LIST_WIDTH }}>
        <ActionList />
      </Box>
      <Divider orientation="vertical" />
      <ActionEditor />
    </Box>
  );
};
