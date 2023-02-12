import { useCallback, useMemo } from 'react';
import {
  endCreateComponentDrag,
  endMoveComponentDrag,
  focusComponent,
  startMoveComponentDrag,
} from '@app/redux/features/editorSlice';
import { Layout, ReactGridLayoutProps } from 'react-grid-layout';
import { Component } from '@app/types';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { COMPONENT_CONFIGS } from '@app/constants';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { createNewComponent } from '../utils/components';
import { hasLayoutMoved, hasLayoutResized } from '../utils/reactGridLayout';
import { useActiveTool } from './useActiveTool';

type CustomReactGridLayoutProps = {
  onDrag: (_layout: Layout[], _oldComponent: Layout, component: Layout) => void;
  onDragStop: () => void;
  onLayoutChange: (newLayout: Layout[]) => void;
  onDrop: (newLayout: Layout[]) => Promise<void>;
  layout: Layout[];
  droppingItem: ReactGridLayoutProps['droppingItem'];
};

export const useReactGridLayoutProps = (): CustomReactGridLayoutProps => {
  const { tool, updateTool } = useActiveTool();
  const components = useMemo(() => tool.components, [tool]);

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

    const { dimensions } = COMPONENT_CONFIGS[newComponent.type];

    return {
      i: newComponent.name,
      w: dimensions.w,
      h: dimensions.h,
    };
  }, [newComponent]);

  const onDrag = useCallback(
    (_layout: Layout[], oldComponent: Layout, component: Layout) => {
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

      const response = await updateTool({ components: newComponents });
      dispatch(endCreateComponentDrag());

      if (!isSuccessfulApiResponse(response)) {
        return;
      }

      dispatch(focusComponent(newComponent.name));
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

      const hasSameIds = newLayout.every(
        (_, i) => newLayout[i].i === layout[i].i
      );
      if (!hasSameIds) {
        return;
      }

      const hasMovedOrResized = newLayout.some(
        (_, i) =>
          hasLayoutResized(layout[i], newLayout[i]) ||
          hasLayoutMoved(layout[i], newLayout[i])
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
    onDrag,
    onDragStop,
    onDrop,
    onLayoutChange,
  };
};
