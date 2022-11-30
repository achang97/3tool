import React, { memo, useCallback, useMemo } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { ComponentType } from 'types';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { RootState } from 'redux/store';
import {
  createComponent,
  endMoveComponent,
  startMoveComponent,
  updateLayout,
} from 'redux/features/canvasSlice';
import { EditorComponent } from './EditorComponent';
import { useLastClickedLocation } from '../../hooks/useLastClickedLocation';

import './editor-canvas.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const EditorCanvas = memo(() => {
  const { layout, components, newComponent, movedComponentId } = useAppSelector(
    (state: RootState) => state.canvas
  );
  const dispatch = useAppDispatch();
  const lastClickedLocation = useLastClickedLocation();

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
      if (!newComponent) {
        dispatch(startMoveComponent(component.i));
      }
    },
    [dispatch, newComponent]
  );

  const handleDragStop = useCallback(() => {
    dispatch(endMoveComponent());
  }, [dispatch]);

  const handleDrop = useCallback(
    (newLayout: Layout[]) => {
      dispatch(updateLayout(newLayout));
      dispatch(createComponent());
    },
    [dispatch]
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
        componentType={components[element.i]}
        lastClickedLocation={lastClickedLocation}
        isDragging={movedComponentId === element.i}
      />
    ));
  }, [layout, components, lastClickedLocation, movedComponentId]);

  return (
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
  );
});
