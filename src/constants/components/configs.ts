import { ComponentType } from '@app/types';
import buttonIcon from '@app/resources/icons/components/button.svg';
import textInputIcon from '@app/resources/icons/components/text-input.svg';
import numberInputIcon from '@app/resources/icons/components/number-input.svg';
import textIcon from '@app/resources/icons/components/text.svg';
import tableIcon from '@app/resources/icons/components/table.svg';

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
