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

type TextInputInput = {
  value: string;
};

type NumberInputInput = {
  value: number;
};

type TableInput = {
  selectedRows: unknown[];
};

type NoInput = {};

/**
 * Constants
 */
const TEXT_INPUT_INPUT_TEMPLATE: TextInputInput = {
  value: '',
};

const NUMBER_INPUT_INPUT_TEMPLATE: NumberInputInput = {
  value: 0,
};

const TABLE_INPUT_TEMPLATE: TableInput = {
  selectedRows: [],
};

const NO_INPUT_TEMPLATE: NoInput = {};

export const COMPONENT_INPUT_TEMPLATES: ComponentInputs = {
  [ComponentType.Button]: NO_INPUT_TEMPLATE,
  [ComponentType.TextInput]: TEXT_INPUT_INPUT_TEMPLATE,
  [ComponentType.NumberInput]: NUMBER_INPUT_INPUT_TEMPLATE,
  [ComponentType.Text]: NO_INPUT_TEMPLATE,
  [ComponentType.Table]: TABLE_INPUT_TEMPLATE,
};
