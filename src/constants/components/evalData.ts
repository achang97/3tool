import { FieldType, ComponentType, Component } from '@app/types';

/**
 * Constants (used for args in evaluation)
 */
type ComponentDataType<T extends ComponentType> = {
  [KeyType in keyof NonNullable<Component['data'][T]>]: FieldType;
};
type ComponentDataTypes = {
  [KeyType in ComponentType]: ComponentDataType<KeyType>;
};

const BUTTON_DATA_TYPES: ComponentDataType<ComponentType.Button> = {
  text: 'string',
  disabled: 'boolean',
  loading: 'boolean',
};

const TEXT_INPUT_DATA_TYPES: ComponentDataType<ComponentType.TextInput> = {
  defaultValue: 'string',
  placeholder: 'string',
  label: 'string',
  disabled: 'boolean',
  required: 'boolean',
  minLength: 'number',
  maxLength: 'number',
};

const NUMBER_INPUT_DATA_TYPES: ComponentDataType<ComponentType.NumberInput> = {
  defaultValue: 'number',
  placeholder: 'string',
  label: 'string',
  disabled: 'boolean',
  required: 'boolean',
  minimum: 'number',
  maximum: 'number',
};

const TEXT_DATA_TYPES: ComponentDataType<ComponentType.Text> = {
  value: 'string',
  horizontalAlignment: 'string',
};

const TABLE_DATA_TYPES: ComponentDataType<ComponentType.Table> = {
  data: 'array',
  emptyMessage: 'string',
  multiselect: 'boolean',
  loading: 'boolean',
  columnHeaderNames: 'nested',
  columnHeadersByIndex: 'nested',
};

export const COMPONENT_DATA_TYPES: ComponentDataTypes = {
  [ComponentType.Button]: BUTTON_DATA_TYPES,
  [ComponentType.TextInput]: TEXT_INPUT_DATA_TYPES,
  [ComponentType.NumberInput]: NUMBER_INPUT_DATA_TYPES,
  [ComponentType.Text]: TEXT_DATA_TYPES,
  [ComponentType.Table]: TABLE_DATA_TYPES,
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

type ButtonEvalData = {
  text: string;
  disabled: boolean;
  loading: boolean;
};

type TextInputEvalData = {
  defaultValue: string;
  placeholder: string;
  label: string;
  disabled: boolean;
  required: boolean;
  minLength: number;
  maxLength: number;
};

type NumberInputEvalData = {
  defaultValue: number;
  placeholder: string;
  label: string;
  disabled: boolean;
  required: boolean;
  minimum: number;
  maximum: number;
};

type TextEvalData = {
  value: string;
  horizontalAlignment: 'left' | 'center' | 'right';
};

type TableEvalData = {
  data: unknown[];
  emptyMessage: string;
  multiselect: boolean;
  loading: boolean;
  // NOTE: Currently only using this for testing
  columnHeaderNames: Record<string, unknown>;
  columnHeadersByIndex: unknown[];
};
