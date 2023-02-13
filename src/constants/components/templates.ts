import {
  ButtonData,
  ComponentData,
  ComponentType,
  NumberInputData,
  TableData,
  TextData,
  TextInputData,
} from '@app/types';

export type ComponentDataTemplates = {
  [KeyType in ComponentType]: NonNullable<ComponentData[KeyType]>;
};

export const BUTTON_DATA_TEMPLATE: ButtonData = {
  text: 'Button',
  disabled: '',
  loading: '',
};

export const TEXT_INPUT_DATA_TEMPLATE: TextInputData = {
  defaultValue: '',
  placeholder: 'Enter value',
  label: 'Label',
  disabled: '',
  required: '',
  minLength: '',
  maxLength: '',
};

export const NUMBER_INPUT_DATA_TEMPLATE: NumberInputData = {
  defaultValue: '0',
  placeholder: 'Enter value',
  label: 'Label',
  disabled: '',
  required: '',
  minimum: '',
  maximum: '',
};

export const TEXT_DATA_TEMPLATE: TextData = {
  value: 'Hello!',
  horizontalAlignment: 'left',
};

export const TABLE_DATA_TEMPLATE: TableData = {
  data: `
[{
  "id": 1,
  "name": "Hanson Deck",
  "email": "hanson@deck.com",
  "sales": 37
}, {
  "id": 2,
  "name": "Sue Shei",
  "email": "sueshei@example.com",
  "sales": 550
}, {
  "id": 3,
  "name": "Jason Response",
  "email": "jason@response.com",
  "sales": 55
}, {
  "id": 4,
  "name": "Cher Actor",
  "email": "cher@example.com",
  "sales": 424
}, {
  "id": 5,
  "name": "Erica Widget",
  "email": "erica@widget.org",
  "sales": 243
}]`.trim(),
  emptyMessage: 'No rows found',
  multiselect: '',
  columnHeaderNames: {},
  columnHeadersByIndex: [],
};

export const COMPONENT_DATA_TEMPLATES: ComponentDataTemplates = {
  [ComponentType.Button]: BUTTON_DATA_TEMPLATE,
  [ComponentType.TextInput]: TEXT_INPUT_DATA_TEMPLATE,
  [ComponentType.NumberInput]: NUMBER_INPUT_DATA_TEMPLATE,
  [ComponentType.Text]: TEXT_DATA_TEMPLATE,
  [ComponentType.Table]: TABLE_DATA_TEMPLATE,
};
