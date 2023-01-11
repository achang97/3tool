import { Box, Divider } from '@mui/material';

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
      <Box sx={{ width: LIST_WIDTH }}>Query List</Box>
      <Divider orientation="vertical" />
      <Box>Query Editor</Box>
    </Box>
  );
};
