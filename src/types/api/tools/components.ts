import { EventHandler } from './eventHandlers';

export enum ComponentType {
  Button = 'button',
  TextInput = 'textInput',
  NumberInput = 'numberInput',
  Table = 'table',
  Text = 'text',
}

export type Component = {
  _id?: string;
  name: string;
  type: ComponentType;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  data: {
    [ComponentType.Button]?: ButtonData;
    [ComponentType.TextInput]?: TextInputData;
    [ComponentType.NumberInput]?: NumberInputData;
    [ComponentType.Text]?: TextData;
    [ComponentType.Table]?: TableData;
  };
  eventHandlers: EventHandler<ComponentEvent>[];
};

export enum ComponentEvent {
  Click = 'click',
  Submit = 'submit',
}

type ButtonData = {
  text: string;
  disabled: string;
  loading: string;
};

type TextInputData = {
  defaultValue: string;
  placeholder: string;
  label: string;
  disabled: string;
  required: string;
  minLength: string;
  maxLength: string;
};

type NumberInputData = {
  defaultValue: string;
  placeholder: string;
  label: string;
  disabled: string;
  required: string;
  minimum: string;
  maximum: string;
};

type TextData = {
  value: string;
  horizontalAlignment: 'left' | 'center' | 'right';
};

type TableData = {
  data: string;
  emptyMessage: string;
  multiselect: string;
  loading: string;
  // NOTE: Currently only using this for testing
  columnHeaderNames: Record<string, string>;
  columnHeadersByIndex: string[];
};
