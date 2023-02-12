import { ComponentData, ComponentType } from './api';

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

export type ComponentInputs = {
  [ComponentType.Button]: {};
  [ComponentType.TextInput]: {
    value: string;
  };
  [ComponentType.NumberInput]: {
    value: number;
  };
  [ComponentType.Text]: {};
  [ComponentType.Table]: {
    selectedRows: unknown[];
  };
};

export type BaseCanvasComponentProps = {
  name: string;
};

export type BaseComponentInspectorProps = {
  name: string;
  data: ComponentData;
  onUpdate: (update: RecursivePartial<ComponentData>) => void;
};
