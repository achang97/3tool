import { useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Component } from '@app/types';
import { useAppSelector } from '@app/redux/hooks';
import { CanvasComponent } from './CanvasComponent';
import { useGetActiveTool } from '../hooks/useGetActiveTool';
import { useUpdateActiveTool } from '../hooks/useUpdateActiveTool';
import { useReactGridLayoutProps } from '../hooks/useReactGridLayoutProps';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const CanvasDroppable = () => {
  const tool = useGetActiveTool();
  const updateTool = useUpdateActiveTool();

  const { movingComponentName, focusedComponentName } = useAppSelector(
    (state) => state.editor
  );

  const components = useMemo(() => {
    return tool ? tool.components : [];
  }, [tool]);

  const handleUpdateToolComponents = useCallback(
    async (newComponents: Component[]) => {
      if (!tool) {
        return;
      }

      await updateTool({
        id: tool.id,
        components: newComponents,
      });
    },
    [tool, updateTool]
  );

  const { onLayoutChange, onDrag, onDragStop, onDrop, layout, droppingItem } =
    useReactGridLayoutProps({
      components,
      onUpdateComponents: handleUpdateToolComponents,
    });

  const gridChildren = useMemo(() => {
    return components.map((component) => (
      <CanvasComponent
        key={component.name}
        name={component.name}
        type={component.type}
        metadata={component.metadata}
        isDragging={component.name === movingComponentName}
        isFocused={component.name === focusedComponentName}
      />
    ));
  }, [components, movingComponentName, focusedComponentName]);

  return (
    <Box data-testid="canvas-droppable">
      <ResponsiveReactGridLayout
        rowHeight={5}
        cols={{
          lg: 48,
          md: 40,
          sm: 24,
          xs: 16,
          xxs: 8,
        }}
        resizeHandles={['s', 'e', 'se']}
        layouts={{ lg: layout }}
        onLayoutChange={onLayoutChange}
        onDrag={onDrag}
        onDragStop={onDragStop}
        onDrop={onDrop}
        compactType={null}
        preventCollision={false}
        droppingItem={droppingItem}
        isDroppable
      >
        {gridChildren}
      </ResponsiveReactGridLayout>
    </Box>
  );
};
