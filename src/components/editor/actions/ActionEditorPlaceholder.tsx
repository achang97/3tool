import { Box, Stack } from '@mui/material';
import { EmptyPlaceholder } from './common/EmptyPlaceholder';
import { EditorToolbar } from './editor/common/EditorToolbar';
import { SizeControlButton } from './editor/common/SizeControlButton';

export const ActionEditorPlaceholder = () => {
  return (
    <Stack sx={{ height: '100%' }} data-testid="action-editor-placeholder">
      <EditorToolbar sx={{ justifyContent: 'flex-end' }}>
        <SizeControlButton />
      </EditorToolbar>
      <Box sx={{ padding: 2, flex: 1 }}>
        <EmptyPlaceholder>Select an action to edit</EmptyPlaceholder>
      </Box>
    </Stack>
  );
};
