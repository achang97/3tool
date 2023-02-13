import { ComponentType } from '@app/types';
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
