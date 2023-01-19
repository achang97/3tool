import { Component, ComponentType } from '@app/types';
import { Layout } from 'react-grid-layout';

export const getNewComponentName = (
  type: ComponentType,
  components: Component[] = []
): string => {
  const componentRegex = new RegExp(`${type}(\\d+)`);

  let numSuffix = 1;
  components.forEach((component) => {
    const match = component.name.match(componentRegex);
    const componentNum = match && parseInt(match[1], 10);

    if (componentNum && componentNum >= numSuffix) {
      numSuffix = componentNum + 1;
    }
  });

  return `${type}${numSuffix}`;
};

export const createNewComponent = (
  type: ComponentType,
  name: string,
  { w, h, x, y }: Layout
): Component => {
  const baseComponent: Component = {
    type,
    name,
    layout: { w, h, x, y },
    metadata: {},
  };

  switch (type) {
    case ComponentType.Button: {
      baseComponent.metadata.button = {
        basic: {
          text: 'Button',
        },
        interaction: {},
      };
      break;
    }
    default:
      break;
  }

  return baseComponent;
};
