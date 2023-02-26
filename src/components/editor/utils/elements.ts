import {
  Action,
  ActionEvent,
  ActionType,
  Component,
  ComponentEvent,
  ComponentType,
  EventHandler,
} from '@app/types';
import _ from 'lodash';

export const getElementData = (
  element:
    | Action
    | Component
    | EventHandler<ActionEvent>
    | EventHandler<ComponentEvent>
) => {
  return _.get(element.data, element.type, {});
};

export const isAction = (element: Action | Component): element is Action => {
  return Object.values(ActionType).includes(element.type as ActionType);
};

export const isComponent = (
  element: Action | Component
): element is Component => {
  return Object.values(ComponentType).includes(element.type as ComponentType);
};

export const parseDepCycle = (cyclePath: string[]): string[] => {
  const lastElement = cyclePath[cyclePath.length - 1];
  const startIndex = cyclePath.indexOf(lastElement);
  return cyclePath.slice(startIndex);
};

export const createNameWithPrefix = (
  prefix: string,
  currentNames: string[]
): string => {
  const prefixRegex = new RegExp(`${prefix}(\\d+)`);

  let numSuffix = 1;
  currentNames.forEach((name) => {
    const match = name.match(prefixRegex);
    const prefixNum = match && parseInt(match[1], 10);

    if (prefixNum && prefixNum >= numSuffix) {
      numSuffix = prefixNum + 1;
    }
  });

  return `${prefix}${numSuffix}`;
};
