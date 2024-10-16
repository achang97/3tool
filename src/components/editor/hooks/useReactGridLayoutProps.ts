import { useCallback, useMemo } from 'react';
import {
  stopCreateComponentDrag,
  stopMoveComponentDrag,
  stopResizeComponent,
  focusComponent,
  startMoveComponentDrag,
  startResizeComponent,
} from '@app/redux/features/editorSlice';
import { Layout, ReactGridLayoutProps } from 'react-grid-layout';
import { Component } from '@app/types';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { COMPONENT_CONFIGS } from '@app/constants';
import { createNewComponent } from '../utils/components';
import { hasLayoutMoved, hasLayoutResized } from '../utils/reactGridLayout';
import { useActiveTool } from './useActiveTool';

type CustomReactGridLayoutProps = {
  onDrag: (_layout: Layout[], _oldComponent: Layout, component: Layout) => void;
  onDragStop: () => void;
  onResizeStart: (_layout: Layout[], _oldComponent: Layout, component: Layout) => void;
  onResizeStop: () => void;
  onLayoutChange: (newLayout: Layout[]) => void;
  onDrop: (newLayout: Layout[]) => Promise<void>;
  layout: Layout[];
  droppingItem: ReactGridLayoutProps['droppingItem'];
};

export const useReactGridLayoutProps = (): CustomReactGridLayoutProps => {
  const { tool, updateTool } = useActiveTool();
  const components = useMemo(() => tool.components, [tool]);

  const { newComponent, movingComponentName } = useAppSelector((state) => state.editor);
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

    const { dimensions } = COMPONENT_CONFIGS[newComponent.type];

    return {
      i: newComponent.name,
      w: dimensions.w,
      h: dimensions.h,
    };
  }, [newComponent]);

  const onResizeStart = useCallback(
    (_layout: Layout[], _oldComponent: Layout, component: Layout) => {
      dispatch(startResizeComponent(component.i));
    },
    [dispatch]
  );

  const onResizeStop = useCallback(() => {
    dispatch(stopResizeComponent());
  }, [dispatch]);

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
    dispatch(stopMoveComponentDrag());
  }, [dispatch]);

  const onDrop = useCallback(
    async (newLayout: Layout[]) => {
      if (!newComponent) {
        return;
      }

      const prevComponents = getComponentsWithLayout(newLayout.slice(0, newLayout.length));
      const newToolComponent = createNewComponent(
        newComponent.type,
        newComponent.name,
        newLayout[newLayout.length - 1]
      );
      const newComponents = [...prevComponents, newToolComponent];

      const updatedTool = await updateTool({ components: newComponents });
      dispatch(stopCreateComponentDrag());
      if (!updatedTool) {
        return;
      }
      dispatch(focusComponent(newToolComponent.name));
    },
    [dispatch, getComponentsWithLayout, newComponent, updateTool]
  );

  const onLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      if (newComponent) {
        return;
      }

      if (newLayout.length !== layout.length) {
        return;
      }

      const hasSameIds = newLayout.every((_, i) => newLayout[i].i === layout[i].i);
      if (!hasSameIds) {
        return;
      }

      const hasMovedOrResized = newLayout.some(
        (_, i) =>
          hasLayoutResized(layout[i], newLayout[i]) || hasLayoutMoved(layout[i], newLayout[i])
      );
      if (!hasMovedOrResized) {
        return;
      }

      updateTool({ components: getComponentsWithLayout(newLayout) });
    },
    [newComponent, layout, updateTool, getComponentsWithLayout]
  );

  return {
    layout,
    droppingItem,
    onResizeStart,
    onResizeStop,
    onDrag,
    onDragStop,
    onDrop,
    onLayoutChange,
  };
};
