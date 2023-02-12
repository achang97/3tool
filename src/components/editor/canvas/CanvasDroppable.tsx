import { useMemo } from 'react';
import { Box } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { CanvasComponent } from './CanvasComponent';
import { useReactGridLayoutProps } from '../hooks/useReactGridLayoutProps';
import { useActiveTool } from '../hooks/useActiveTool';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const NUM_COLS = 48;

export const CanvasDroppable = () => {
  const { tool } = useActiveTool();

  const { onLayoutChange, onDrag, onDragStop, onDrop, layout, droppingItem } =
    useReactGridLayoutProps();

  const gridChildren = useMemo(() => {
    return tool.components.map((component) => (
      <CanvasComponent
        key={component.name}
        name={component.name}
        type={component.type}
      />
    ));
  }, [tool.components]);

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
