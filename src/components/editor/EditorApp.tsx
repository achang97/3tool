import { Stack } from '@mui/material';
import { CanvasDroppable } from './canvas/CanvasDroppable';
import { CanvasToolbar } from './canvas/CanvasToolbar';
import { useActionMountExecute } from './hooks/useActionMountExecute';
import { useActionQueueExecutor } from './hooks/useActionQueueExecutor';
import { FullscreenLoader } from '../common/FullscreenLoader';

type EditorAppProps = {
  isEditable: boolean;
};

export const EditorApp = ({ isEditable }: EditorAppProps) => {
  const { isLoading } = useActionMountExecute();
  useActionQueueExecutor();

  return (
    <Stack sx={{ height: '100%', paddingBottom: 10 }} data-testid="editor-app">
      <CanvasToolbar />
      {isLoading ? <FullscreenLoader /> : <CanvasDroppable isEditable={isEditable} />}
    </Stack>
  );
};
