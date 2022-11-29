import React, { memo, useCallback, useMemo, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { ComponentType } from 'types';
import { useAppSelector } from 'redux/hooks';
import { RootState } from 'redux/store';
import { EditorComponent } from './EditorComponent';
import { useLastClickedLocation } from '../../hooks/useLastClickedLocation';

import './editor-canvas.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const EditorCanvas = memo(() => {
  const [layoutData, setLayoutData] = useState<Layout[]>(
    JSON.parse(localStorage.getItem('layout') ?? '[]')
  );
  const [components, setComponents] = useState<Record<string, ComponentType>>(
    JSON.parse(localStorage.getItem('components') ?? '{}')
  );
  const [draggingComponent, setDraggingComponent] = useState<string>();

  const { isCreating, newComponentType } = useAppSelector(
    (state: RootState) => state.canvas
  );
  const lastClickedLocation = useLastClickedLocation();

  const updateLayoutData = useCallback((layout: Layout[]) => {
    localStorage.setItem('layout', JSON.stringify(layout));
    setLayoutData(layout);
  }, []);

  const updateComponents = useCallback(
    (id: string) => {
      setComponents((prevComponents) => {
        const newComponents = {
          ...prevComponents,
          [id]: newComponentType!,
        };
        localStorage.setItem('components', JSON.stringify(newComponents));
        return newComponents;
      });
    },
    [newComponentType]
  );

  const handleLayoutChange = useCallback(
    (layout: Layout[]) => {
      if (!isCreating) {
        updateLayoutData(layout);
      }
    },
    [isCreating, updateLayoutData]
  );

  const handleDrag = useCallback(
    (_layout: Layout[], _oldComponent: Layout, newComponent: Layout) => {
      if (!isCreating) {
        setDraggingComponent(newComponent.i);
      }
    },
    [isCreating]
  );

  const handleDragStop = useCallback(() => {
    setDraggingComponent(undefined);
  }, []);

  const handleDrop = useCallback(
    (layout: Layout[], item: Layout) => {
      updateLayoutData(layout);
      updateComponents(item.i);
    },
    [updateLayoutData, updateComponents]
  );

  const droppingItem = useMemo(() => {
    const baseItem = { i: Math.floor(Math.random() * 100_000_000).toString() };
    switch (newComponentType) {
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
  }, [newComponentType]);

  const layout = useMemo(() => {
    return layoutData.map((element) => (
      <EditorComponent
        key={element.i}
        componentType={components[element.i]}
        lastClickedLocation={lastClickedLocation}
        isDragging={draggingComponent === element.i}
      />
    ));
  }, [layoutData, components, lastClickedLocation, draggingComponent]);

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
      layouts={{ lg: layoutData }}
      onLayoutChange={handleLayoutChange}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onDrop={handleDrop}
      compactType={null}
      preventCollision={false}
      droppingItem={droppingItem}
      isDroppable
    >
      {layout}
    </ResponsiveReactGridLayout>
  );
});
