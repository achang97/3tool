import { Action, ActionType, Component, ComponentType } from './api';

export enum SidebarViewType {
  Inspector = 'inspector',
  Components = 'components',
}

export type FieldType =
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

export type BaseComponentInspectorProps<T extends ComponentType> = {
  data: Component['data'][T];
  onUpdateData: (update: RecursivePartial<Component['data'][T]>) => void;
};

export type BaseActionEditorProps<T extends ActionType> = {
  data: Action['data'][T];
  onUpdateData: (update: RecursivePartial<Action['data'][T]>) => void;
};
