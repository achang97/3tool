import { useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { ComponentType } from '@app/types';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import {
  createComponent,
  endCreateComponentDrag,
  endMoveComponentDrag,
  focusComponent,
  startMoveComponentDrag,
  updateLayout,
} from '@app/redux/features/editorSlice';
import { EditorComponent } from './EditorComponent';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const EditorDroppable = () => {
  const {
    layout,
    components,
    newComponent,
    movingComponentId,
    focusedComponentId,
  } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      if (!newComponent) {
        dispatch(updateLayout(newLayout));
      }
    },
    [newComponent, dispatch]
  );

  const handleDrag = useCallback(
    (_layout: Layout[], _oldComponent: Layout, component: Layout) => {
      if (!newComponent && !movingComponentId) {
        dispatch(startMoveComponentDrag(component.i));
        dispatch(focusComponent(component.i));
      }
    },
    [dispatch, newComponent, movingComponentId]
  );

  const handleDragStop = useCallback(() => {
    dispatch(endMoveComponentDrag());
  }, [dispatch]);

  const handleDrop = useCallback(
    (newLayout: Layout[]) => {
      if (!newComponent) {
        return;
      }

      dispatch(endCreateComponentDrag());
      dispatch(updateLayout(newLayout));

      dispatch(createComponent(newComponent));
      dispatch(focusComponent(newComponent.id));
    },
    [dispatch, newComponent]
  );

  const droppingItem = useMemo(() => {
    if (!newComponent?.id) {
      return undefined;
    }

    const baseItem = { i: newComponent.id };
    switch (newComponent?.type) {
      case ComponentType.Button:
        return { ...baseItem, w: 8, h: 4 };
      case ComponentType.Select:
      case ComponentType.TextInput:
        return { ...baseItem, w: 8, h: 4 };
      case ComponentType.Table:
        return { ...baseItem, w: 8, h: 8 };
      default:
        return { ...baseItem, w: 8, h: 4 };
    }
  }, [newComponent]);

  const gridComponents = useMemo(() => {
    return layout.map((element) => (
      <EditorComponent
        key={element.i}
        componentId={element.i}
        componentType={components[element.i]}
        isDragging={element.i === movingComponentId}
        isFocused={element.i === focusedComponentId}
      />
    ));
  }, [layout, components, movingComponentId, focusedComponentId]);

  return (
    <Box>
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
        onLayoutChange={handleLayoutChange}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onDrop={handleDrop}
        compactType={null}
        preventCollision={false}
        droppingItem={droppingItem}
        isDroppable
      >
        {gridComponents}
      </ResponsiveReactGridLayout>
    </Box>
  );
};
