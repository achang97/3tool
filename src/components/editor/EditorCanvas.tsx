import { Box, Typography } from '@mui/material';
import { EditorDroppable } from './EditorDroppable';
import { EditorToolbar } from './EditorToolbar';

export const EditorCanvas = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'greyscale.offwhite.main',
        paddingX: 4,
        paddingY: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Typography variant="caption" sx={{ marginBottom: 1 }}>
        project
      </Typography>
      <Box
        sx={{
          borderRadius: 1,
          backgroundColor: 'background.paper',
          boxShadow: 4,
        }}
      >
        <EditorToolbar />
        <EditorDroppable />
      </Box>
    </Box>
  );
};
