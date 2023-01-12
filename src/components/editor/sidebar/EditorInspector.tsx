import { useAppSelector } from '@app/redux/hooks';
import { Box } from '@mui/material';
import { EditorComponentInspector } from './EditorComponentInspector';
import { EditorToolInspector } from './EditorToolInspector';

export const EditorInspector = () => {
  const { focusedComponentId } = useAppSelector((state) => state.editor);

  return (
    <Box data-testid="editor-inspector">
      {focusedComponentId ? (
        <EditorComponentInspector />
      ) : (
        <EditorToolInspector />
      )}
    </Box>
  );
};
