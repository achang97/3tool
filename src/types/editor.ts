import { ComponentData } from './api';

export enum SidebarViewType {
  Inspector = 'inspector',
  Components = 'components',
}

export type ComponentFieldType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'array'
  | 'object'
  | 'any'
  | 'nested';

export type BaseCanvasComponentProps = {
  name: string;
};

export type BaseComponentInspectorProps = {
  name: string;
  data: ComponentData;
  onUpdate: (update: RecursivePartial<ComponentData>) => void;
};
