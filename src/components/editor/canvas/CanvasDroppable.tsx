import { useMemo } from 'react';
import { Box } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { CanvasComponent } from './CanvasComponent';
import { useReactGridLayoutProps } from '../hooks/useReactGridLayoutProps';
import { useActiveTool } from '../hooks/useActiveTool';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const NUM_COLS = 48;

type CanvasDroppableProps = {
  isEditable: boolean;
};

export const CanvasDroppable = ({ isEditable }: CanvasDroppableProps) => {
  const { tool } = useActiveTool();

  const {
    onLayoutChange,
    onResizeStart,
    onResizeStop,
    onDrag,
    onDragStop,
    onDrop,
    layout,
    droppingItem,
  } = useReactGridLayoutProps();

  const gridChildren = useMemo(() => {
    return tool.components.map((component) => (
      <CanvasComponent key={component.name} component={component} isEditable={isEditable} />
    ));
  }, [isEditable, tool.components]);

  return (
    <Box data-testid="canvas-droppable">
      <ResponsiveReactGridLayout
        rowHeight={5}
        cols={{
          // TODO: Figure out responsive sizing
          lg: NUM_COLS,
          md: NUM_COLS,
          sm: NUM_COLS,
          xs: NUM_COLS,
          xxs: NUM_COLS,
        }}
        resizeHandles={['s', 'e', 'se']}
        layouts={{ lg: layout }}
        onLayoutChange={onLayoutChange}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        onDrag={onDrag}
        onDragStop={onDragStop}
        onDrop={onDrop}
        compactType={null}
        preventCollision
        droppingItem={droppingItem}
        isDroppable={isEditable}
        isDraggable={isEditable}
      >
        {gridChildren}
      </ResponsiveReactGridLayout>
    </Box>
  );
};
