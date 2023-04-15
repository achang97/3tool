import { useAppSelector } from '@app/redux/hooks';
import { Stack } from '@mui/material';
import { useMemo } from 'react';
import { EditorActions } from './EditorActions';
import { EditorCanvas } from './EditorCanvas';
import { EditorSidebar } from './EditorSidebar';
import { useToolElementNames } from './hooks/useToolElementNames';

export const Editor = () => {
  const { elementNames } = useToolElementNames();
  const { isPreview } = useAppSelector((state) => state.editor);

  const rerenderKey = useMemo(() => {
    return elementNames.join('|');
  }, [elementNames]);

  if (isPreview) {
    return <EditorCanvas isEditable={false} />;
  }

  return (
    <Stack direction="row" sx={{ flex: 1, minHeight: 0 }} data-testid="editor">
      <Stack sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <EditorCanvas isEditable />
        <EditorActions />
      </Stack>
      <Stack key={rerenderKey}>
        <EditorSidebar />
      </Stack>
    </Stack>
  );
};
