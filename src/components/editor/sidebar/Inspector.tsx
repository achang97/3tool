import { useAppSelector } from '@app/redux/hooks';
import { Box } from '@mui/material';
import { ComponentInspector } from './inspector/ComponentInspector';
import { ToolInspector } from './inspector/ToolInspector';

export const Inspector = () => {
  const { focusedComponentName } = useAppSelector((state) => state.editor);

  return (
    <Box data-testid="inspector">
      {focusedComponentName ? (
        <ComponentInspector name={focusedComponentName} />
      ) : (
        <ToolInspector />
      )}
    </Box>
  );
};
