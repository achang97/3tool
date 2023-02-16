import { COMPONENT_DATA_TEMPLATES } from '@app/constants';
import { Component, ComponentType } from '@app/types';
import { Layout } from 'react-grid-layout';

export const createNewComponent = (
  type: ComponentType,
  name: string,
  { w, h, x, y }: Layout
): Component => {
  const baseComponent: Component = {
    type,
    name,
    layout: { w, h, x, y },
    data: {
      [type]: COMPONENT_DATA_TEMPLATES[type],
    },
    eventHandlers: [],
  };

  return baseComponent;
};

export const getComponentData = (component: Component) => {
  return component.data[component.type] ?? {};
};
