import { ComponentFieldType, ComponentData, ComponentType } from '@app/types';
import buttonIcon from '@app/resources/icons/button.svg';
import textInputIcon from '@app/resources/icons/text-input.svg';
import numberInputIcon from '@app/resources/icons/number-input.svg';
import textIcon from '@app/resources/icons/text.svg';
import tableIcon from '@app/resources/icons/table.svg';

type ComponentConfig = {
  label: string;
  icon: string;
  dimensions: {
    w: number;
    h: number;
  };
};

export const COMPONENT_CONFIGS: Record<ComponentType, ComponentConfig> = {
  [ComponentType.Button]: {
    label: 'Button',
    icon: buttonIcon,
    dimensions: {
      w: 8,
      h: 4,
    },
  },
  [ComponentType.TextInput]: {
    label: 'Text Input',
    icon: textInputIcon,
    dimensions: {
      w: 8,
      h: 7,
    },
  },
  [ComponentType.NumberInput]: {
    label: 'Number Input',
    icon: numberInputIcon,
    dimensions: {
      w: 8,
      h: 7,
    },
  },
  [ComponentType.Text]: {
    label: 'Text',
    dimensions: {
      w: 4,
      h: 4,
    },
    icon: textIcon,
  },
  [ComponentType.Table]: {
    label: 'Table',
    icon: tableIcon,
    dimensions: {
      w: 16,
      h: 28,
    },
  },
};

export type ComponentDataTemplates = {
  [KeyType in ComponentType]: NonNullable<ComponentData[KeyType]>;
};

export const COMPONENT_DATA_TEMPLATES: ComponentDataTemplates = {
  [ComponentType.Button]: {
    text: 'Button',
    disabled: '',
    loading: '',
  },
  [ComponentType.TextInput]: {
    defaultValue: '',
    placeholder: 'Enter value',
    label: 'Label',
    disabled: '',
    required: '',
    minLength: '',
    maxLength: '',
  },
  [ComponentType.NumberInput]: {
    defaultValue: '0',
    placeholder: 'Enter value',
    label: 'Label',
    disabled: '',
    required: '',
    minimum: '',
    maximum: '',
  },
  [ComponentType.Text]: {
    value: 'Hello!',
    horizontalAlignment: 'left',
  },
  [ComponentType.Table]: {
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
  },
};

export type ComponentDataTypes = {
  [KeyType in ComponentType]: {
    [FieldType in keyof NonNullable<ComponentData[KeyType]>]:
      | ComponentFieldType
      | ComponentFieldType[];
  };
};

export const COMPONENT_DATA_TYPES: ComponentDataTypes = {
  [ComponentType.Button]: {
    text: 'string',
    disabled: 'boolean',
    loading: 'boolean',
  },
  [ComponentType.TextInput]: {
    defaultValue: 'string',
    placeholder: 'string',
    label: 'string',
    disabled: 'boolean',
    required: 'boolean',
    minLength: 'number',
    maxLength: 'number',
  },
  [ComponentType.NumberInput]: {
    defaultValue: 'number',
    placeholder: 'string',
    label: 'string',
    disabled: 'boolean',
    required: 'boolean',
    minimum: 'number',
    maximum: 'number',
  },
  [ComponentType.Text]: {
    value: 'string',
    horizontalAlignment: 'string',
  },
  [ComponentType.Table]: {
    data: 'array',
    emptyMessage: 'string',
    multiselect: 'boolean',
    columnHeaderNames: 'nested',
    columnHeadersByIndex: 'nested',
  },
};

export type ComponentEvalData = {
  [ComponentType.Button]?: {
    text: string;
    disabled: boolean;
    loading: boolean;
  };
  [ComponentType.TextInput]?: {
    defaultValue: string;
    placeholder: string;
    label: string;
    disabled: boolean;
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  [ComponentType.NumberInput]?: {
    defaultValue: number;
    placeholder: string;
    label: string;
    disabled: boolean;
    required: boolean;
    minimum: number;
    maximum: number;
  };
  [ComponentType.Text]?: {
    value: string;
    horizontalAlignment: 'left' | 'center' | 'right';
  };
  [ComponentType.Table]?: {
    data: unknown[];
    emptyMessage: string;
    multiselect: boolean;
    // NOTE: Currently only using this for testing
    columnHeaderNames: Record<string, unknown>;
    columnHeadersByIndex: unknown[];
  };
};

export type ComponentInputs = {
  [ComponentType.Button]: {};
  [ComponentType.TextInput]: {
    value: string;
  };
  [ComponentType.NumberInput]: {
    value: number;
  };
  [ComponentType.Text]: {};
  [ComponentType.Table]: {
    selectedRows: unknown[];
  };
};

export const COMPONENT_INPUT_TEMPLATES: ComponentInputs = {
  [ComponentType.Button]: {},
  [ComponentType.TextInput]: {
    value: '',
  },
  [ComponentType.NumberInput]: {
    value: 0,
  },
  [ComponentType.Text]: {},
  [ComponentType.Table]: {
    selectedRows: [],
  },
};
