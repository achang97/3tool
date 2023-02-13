import { ComponentType } from '@app/types';

/**
 * Type Definitions
 */
export type ComponentInputs = {
  [ComponentType.Button]: NoInput;
  [ComponentType.TextInput]: TextInputInput;
  [ComponentType.NumberInput]: NumberInputInput;
  [ComponentType.Text]: NoInput;
  [ComponentType.Table]: TableInput;
};

export type TextInputInput = {
  value: string;
};

export type NumberInputInput = {
  value: number;
};

export type TableInput = {
  selectedRows: unknown[];
};

export type NoInput = {};

/**
 * Constants
 */
export const TEXT_INPUT_INPUT_TEMPLATE: TextInputInput = {
  value: '',
};

export const NUMBER_INPUT_INPUT_TEMPLATE: NumberInputInput = {
  value: 0,
};

export const TABLE_INPUT_TEMPLATE: TableInput = {
  selectedRows: [],
};

export const NO_INPUT_TEMPLATE: NoInput = {};

export const COMPONENT_INPUT_TEMPLATES: ComponentInputs = {
  [ComponentType.Button]: NO_INPUT_TEMPLATE,
  [ComponentType.TextInput]: TEXT_INPUT_INPUT_TEMPLATE,
  [ComponentType.NumberInput]: NUMBER_INPUT_INPUT_TEMPLATE,
  [ComponentType.Text]: NO_INPUT_TEMPLATE,
  [ComponentType.Table]: TABLE_INPUT_TEMPLATE,
};
