import { useCallback, useMemo } from 'react';
import {
  endCreateComponentDrag,
  endMoveComponentDrag,
  focusComponent,
  startMoveComponentDrag,
} from '@app/redux/features/editorSlice';
import { Layout, ReactGridLayoutProps } from 'react-grid-layout';
import { Component, ComponentType } from '@app/types';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { createNewComponent } from '../utils/editor';

type HookArgs = {
  components: Component[];
  onUpdateComponents: (newComponents: Component[]) => Promise<void>;
};

type HookReturnType = {
  onDrag: (_layout: Layout[], _oldComponent: Layout, component: Layout) => void;
  onDragStop: () => void;
  onLayoutChange: (newLayout: Layout[]) => void;
  onDrop: (newLayout: Layout[]) => Promise<void>;
  layout: Layout[];
  droppingItem: ReactGridLayoutProps['droppingItem'];
};

export const useReactGridLayoutProps = ({
  components,
  onUpdateComponents,
}: HookArgs): HookReturnType => {
  const { newComponent, movingComponentName } = useAppSelector(
    (state) => state.editor
  );
  const dispatch = useAppDispatch();

  const getComponentsWithLayout = useCallback(
    (newLayout: Layout[]): Component[] => {
      return components.map((component, i) => {
        const { x, y, w, h } = newLayout[i];
        return {
          ...component,
          layout: { x, y, w, h },
        };
      });
    },
    [components]
  );

  const layout: Layout[] = useMemo(() => {
    return components.map((component) => ({
      i: component.name,
      ...component.layout,
    }));
  }, [components]);

  const droppingItem = useMemo(() => {
    if (!newComponent) {
      return undefined;
    }

    const baseItem = { i: newComponent.name };

    switch (newComponent.type) {
      case ComponentType.Button:
        return { ...baseItem, w: 8, h: 4 };
      default:
        return { ...baseItem, w: 8, h: 4 };
    }
  }, [newComponent]);

  const onDrag = useCallback(
    (_layout: Layout[], _oldComponent: Layout, component: Layout) => {
      if (!newComponent && !movingComponentName) {
        dispatch(startMoveComponentDrag(component.i));
        dispatch(focusComponent(component.i));
      }
    },
    [dispatch, newComponent, movingComponentName]
  );

  const onDragStop = useCallback(() => {
    dispatch(endMoveComponentDrag());
  }, [dispatch]);

  const onDrop = useCallback(
    async (newLayout: Layout[]) => {
      if (!newComponent) {
        return;
      }

      const prevComponents = getComponentsWithLayout(
        newLayout.slice(0, newLayout.length)
      );
      const newToolComponent = createNewComponent(
        newComponent.type,
        newComponent.name,
        newLayout[newLayout.length - 1]
      );
      const newComponents = [...prevComponents, newToolComponent];

      try {
        await onUpdateComponents(newComponents);
        dispatch(focusComponent(newComponent.name));
      } catch {
        // Do nothing
      }

      dispatch(endCreateComponentDrag());
    },
    [dispatch, getComponentsWithLayout, newComponent, onUpdateComponents]
  );

  const onLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      if (newComponent) {
        return;
      }

      if (newLayout.length !== layout.length) {
        return;
      }

      const hasSameIds = newLayout.every(
        (_, i) => newLayout[i].i === layout[i].i
      );
      if (!hasSameIds) {
        return;
      }

      const hasMovedOrResized = newLayout.some(
        (_, i) =>
          newLayout[i].w !== layout[i].w ||
          newLayout[i].h !== layout[i].h ||
          newLayout[i].x !== layout[i].x ||
          newLayout[i].y !== layout[i].y
      );
      if (!hasMovedOrResized) {
        return;
      }

      onUpdateComponents(getComponentsWithLayout(newLayout));
    },
    [newComponent, layout, onUpdateComponents, getComponentsWithLayout]
  );

  return {
    layout,
    droppingItem,
    onDrag,
    onDragStop,
    onDrop,
    onLayoutChange,
  };
};
