import { Component, useCallback, useMemo, useRef } from 'react';
import {
  Layout,
  Responsive,
  ResponsiveProps,
  WidthProvider,
  WidthProviderProps,
} from 'react-grid-layout';
import { ComponentType } from '@app/types';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import {
  createComponent,
  endCreateComponentDrag,
  endMoveComponent,
  focusComponent,
  startMoveComponent,
  updateLayout,
} from '@app/redux/features/editorSlice';
import { ToolEditorComponent } from './ToolEditorComponent';
import { useFocusClickedComponent } from '../../hooks/useFocusClickedComponent';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const ToolEditorCanvas = () => {
  const {
    layout,
    components,
    newComponent,
    movingComponentId,
    focusedComponentId,
  } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const gridRef = useRef<Component<ResponsiveProps & WidthProviderProps>>(null);

  useFocusClickedComponent(
    // @ts-ignore elementRef should be defined on WidthProvider
    gridRef.current?.elementRef
  );

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
      dispatch(endCreateComponentDrag());
      dispatch(focusComponent(newComponent!.id));
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
      <ToolEditorComponent
        key={element.i}
        componentId={element.i}
        componentType={components[element.i]}
        isDragging={element.i === movingComponentId}
        isFocused={element.i === focusedComponentId}
      />
    ));
  }, [layout, components, movingComponentId, focusedComponentId]);

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
      ref={gridRef}
    >
      {gridComponents}
    </ResponsiveReactGridLayout>
  );
};
