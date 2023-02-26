import { Action, ActionType, Component } from './api';

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

export type BaseComponentInspectorProps = {
  name: string;
  data: Component['data'];
  onUpdateData: (update: RecursivePartial<ValueOf<Component['data']>>) => void;
};

export type BaseActionEditorProps = {
  // NOTE: We need this field for editor views that aggregate multiple
  // types (Smart Contract Read/Write).
  type: ActionType;
  data: Action['data'];
  onUpdateData: (update: RecursivePartial<ValueOf<Action['data']>>) => void;
};
