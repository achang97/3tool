export type Component = {
  name: string;
  type: ComponentType;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  data: ComponentData;
};

export enum ComponentType {
  Button = 'button',
  TextInput = 'textInput',
  NumberInput = 'numberInput',
  Table = 'table',
  Text = 'text',
}

export type ComponentData = {
  [ComponentType.Button]?: ButtonData;
  [ComponentType.TextInput]?: TextInputData;
  [ComponentType.NumberInput]?: NumberInputData;
  [ComponentType.Text]?: TextData;
  [ComponentType.Table]?: TableData;
};

export type ButtonData = {
  text: string;
  disabled: string;
  loading: string;
};

export type TextInputData = {
  defaultValue: string;
  placeholder: string;
  label: string;
  disabled: string;
  required: string;
  minLength: string;
  maxLength: string;
};

export type NumberInputData = {
  defaultValue: string;
  placeholder: string;
  label: string;
  disabled: string;
  required: string;
  minimum: string;
  maximum: string;
};

export type TextData = {
  value: string;
  horizontalAlignment: 'left' | 'center' | 'right';
};

export type TableData = {
  data: string;
  emptyMessage: string;
  multiselect: string;
  // NOTE: Currently only using this for testing
  columnHeaderNames: Record<string, string>;
  columnHeadersByIndex: string[];
};
