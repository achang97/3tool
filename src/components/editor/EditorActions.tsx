import { useAppSelector } from '@app/redux/hooks';
import { Box, Divider, Stack } from '@mui/material';
import { ActionEditor } from './actions/ActionEditor';
import { ActionEditorPlaceholder } from './actions/ActionEditorPlaceholder';
import { ActionList } from './actions/ActionList';

const LIST_WIDTH = '260px';

export const EditorActions = () => {
  const { focusedAction } = useAppSelector((state) => state.editor);

  return (
    <Stack direction="row" sx={{ height: '100%', flexShrink: 0 }} data-testid="editor-actions">
      <Box sx={{ width: LIST_WIDTH, flexShrink: 0 }}>
        <ActionList />
      </Box>
      <Divider orientation="vertical" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {focusedAction ? <ActionEditor action={focusedAction} /> : <ActionEditorPlaceholder />}
      </Box>
    </Stack>
  );
};
