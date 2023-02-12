import { useAppSelector } from '@app/redux/hooks';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useActiveTool } from '../hooks/useActiveTool';
import { ComponentInspector } from './inspector/ComponentInspector';
import { ToolInspector } from './inspector/ToolInspector';

export const Inspector = () => {
  const { tool } = useActiveTool();
  const { focusedComponentName } = useAppSelector((state) => state.editor);

  const component = useMemo(() => {
    return tool.components.find(
      (currComponent) => currComponent.name === focusedComponentName
    );
  }, [focusedComponentName, tool.components]);

  return (
    <Box data-testid="inspector" sx={{ height: '100%' }}>
      {component ? (
        <ComponentInspector component={component} />
      ) : (
        <ToolInspector />
      )}
    </Box>
  );
};
