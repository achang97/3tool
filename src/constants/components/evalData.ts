import { ComponentFieldType, ComponentData, ComponentType } from '@app/types';

/**
 * Constants (used for args in evaluation)
 */
export type ComponentDataType<T extends ComponentType> = {
  [FieldType in keyof NonNullable<ComponentData[T]>]:
    | ComponentFieldType
    | ComponentFieldType[];
};
export type ComponentDataTypes = {
  [KeyType in ComponentType]: ComponentDataType<KeyType>;
};

export const ButtonDataTypes: ComponentDataType<ComponentType.Button> = {
  text: 'string',
  disabled: 'boolean',
  loading: 'boolean',
};

export const TextInputDataTypes: ComponentDataType<ComponentType.TextInput> = {
  defaultValue: 'string',
  placeholder: 'string',
  label: 'string',
  disabled: 'boolean',
  required: 'boolean',
  minLength: 'number',
  maxLength: 'number',
};

export const NumberInputDataTypes: ComponentDataType<ComponentType.NumberInput> =
  {
    defaultValue: 'number',
    placeholder: 'string',
    label: 'string',
    disabled: 'boolean',
    required: 'boolean',
    minimum: 'number',
    maximum: 'number',
  };

export const TextDataTypes: ComponentDataType<ComponentType.Text> = {
  value: 'string',
  horizontalAlignment: 'string',
};

export const TableDataTypes: ComponentDataType<ComponentType.Table> = {
  data: 'array',
  emptyMessage: 'string',
  multiselect: 'boolean',
  columnHeaderNames: 'nested',
  columnHeadersByIndex: 'nested',
};

export const COMPONENT_DATA_TYPES: ComponentDataTypes = {
  [ComponentType.Button]: ButtonDataTypes,
  [ComponentType.TextInput]: TextInputDataTypes,
  [ComponentType.NumberInput]: NumberInputDataTypes,
  [ComponentType.Text]: TextDataTypes,
  [ComponentType.Table]: TableDataTypes,
};

/**
 * Type Definitions (used post-evaluation)
 */
export type ComponentEvalData = {
  [ComponentType.Button]?: ButtonEvalData;
  [ComponentType.TextInput]?: TextInputEvalData;
  [ComponentType.NumberInput]?: NumberInputEvalData;
  [ComponentType.Text]?: TextEvalData;
  [ComponentType.Table]?: TableEvalData;
};

export type ButtonEvalData = {
  text: string;
  disabled: boolean;
  loading: boolean;
};

export type TextInputEvalData = {
  defaultValue: string;
  placeholder: string;
  label: string;
  disabled: boolean;
  required: boolean;
  minLength: number;
  maxLength: number;
};

export type NumberInputEvalData = {
  defaultValue: number;
  placeholder: string;
  label: string;
  disabled: boolean;
  required: boolean;
  minimum: number;
  maximum: number;
};

export type TextEvalData = {
  value: string;
  horizontalAlignment: 'left' | 'center' | 'right';
};

export type TableEvalData = {
  data: unknown[];
  emptyMessage: string;
  multiselect: boolean;
  // NOTE: Currently only using this for testing
  columnHeaderNames: Record<string, unknown>;
  columnHeadersByIndex: unknown[];
};
