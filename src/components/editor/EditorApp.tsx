import { Box } from '@mui/material';
import { CanvasDroppable } from './canvas/CanvasDroppable';
import { CanvasToolbar } from './canvas/CanvasToolbar';
import { useActionMountExecute } from './hooks/useActionMountExecute';
import { useActionQueueExecutor } from './hooks/useActionQueueExecutor';

type EditorAppProps = {
  isEditable: boolean;
};

export const EditorApp = ({ isEditable }: EditorAppProps) => {
  useActionMountExecute();
  useActionQueueExecutor();

  return (
    <Box data-testid="editor-app">
      <CanvasToolbar />
      <CanvasDroppable isEditable={isEditable} />
    </Box>
  );
};
