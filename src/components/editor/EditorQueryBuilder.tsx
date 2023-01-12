import { Box, Divider } from '@mui/material';
import { QueryEditor } from './queries/QueryEditor';
import { QueryList } from './queries/QueryList';

const HEIGHT = '250px';
const LIST_WIDTH = '260px';

export const EditorQueryBuilder = () => {
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
        <QueryList />
      </Box>
      <Divider orientation="vertical" />
      <QueryEditor />
    </Box>
  );
};
