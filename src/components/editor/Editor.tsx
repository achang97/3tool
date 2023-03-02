import { Box } from '@mui/material';
import { useMemo } from 'react';
import { EditorActions } from './EditorActions';
import { EditorCanvas } from './EditorCanvas';
import { EditorSidebar } from './EditorSidebar';
import { useActionQueueExecutor } from './hooks/useActionQueueExecutor';
import { useToolElementNames } from './hooks/useToolElementNames';

export const Editor = () => {
  const { elementNames } = useToolElementNames();
  useActionQueueExecutor();

  const rerenderKey = useMemo(() => {
    return elementNames.join('|');
  }, [elementNames]);

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }} data-testid="editor">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
        }}
      >
        <EditorCanvas />
        <EditorActions />
      </Box>
      <Box
        key={rerenderKey}
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <EditorSidebar />
      </Box>
    </Box>
  );
};
