import { Component, ComponentType } from '@app/types';

type ComponentDataTemplate<T extends ComponentType> = Component['data'][T];
type ComponentDataTemplates = {
  [KeyType in ComponentType]: NonNullable<Component['data'][KeyType]>;
};

const BUTTON_DATA_TEMPLATE: ComponentDataTemplate<ComponentType.Button> = {
  text: 'Button',
  disabled: '',
  loading: '',
};

const TEXT_INPUT_DATA_TEMPLATE: ComponentDataTemplate<ComponentType.TextInput> = {
  defaultValue: '',
  placeholder: 'Enter value',
  label: 'Label',
  disabled: '',
  required: '',
  minLength: '',
  maxLength: '',
};

const NUMBER_INPUT_DATA_TEMPLATE: ComponentDataTemplate<ComponentType.NumberInput> = {
  defaultValue: '0',
  placeholder: 'Enter value',
  label: 'Label',
  disabled: '',
  required: '',
  minimum: '',
  maximum: '',
};

const TEXT_DATA_TEMPLATE: ComponentDataTemplate<ComponentType.Text> = {
  value: 'Hello!',
  horizontalAlignment: 'left',
};

const TABLE_DATA_TEMPLATE: ComponentDataTemplate<ComponentType.Table> = {
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
