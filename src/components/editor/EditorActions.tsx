import { useAppSelector } from '@app/redux/hooks';
import { Box, Divider } from '@mui/material';
import { ActionEditor } from './actions/ActionEditor';
import { ActionEditorPlaceholder } from './actions/ActionEditorPlaceholder';
import { ActionList } from './actions/ActionList';

export const MINIMIZED_HEIGHT = '250px';
export const MAXIMIZED_HEIGHT = '80vh';
const LIST_WIDTH = '260px';

export const EditorActions = () => {
  const { focusedAction, isActionViewMaximized } = useAppSelector((state) => state.editor);

  return (
    <Box
      sx={{
        height: isActionViewMaximized ? MAXIMIZED_HEIGHT : MINIMIZED_HEIGHT,
        display: 'flex',
        boxShadow: 3,
        flexShrink: 0,
        // NOTE: Removes the overlapping shadow on the right side of the container.
        clipPath: 'inset(-5px 0px -5px -5px)',
      }}
      data-testid="editor-actions"
    >
      <Box sx={{ width: LIST_WIDTH, flexShrink: 0 }}>
        <ActionList />
      </Box>
      <Divider orientation="vertical" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {focusedAction ? <ActionEditor action={focusedAction} /> : <ActionEditorPlaceholder />}
      </Box>
    </Box>
  );
};
