import { ActionMethod, ActionType } from '@app/types';
import javascriptIcon from '@app/resources/icons/actions/javascript.svg';
import smartContractIcon from '@app/resources/icons/actions/smart-contract.svg';

type ActionConfig = {
  label: string;
  icon: string;
  mode: 'read' | 'write';
};

export const ACTION_CONFIGS: Record<ActionType, ActionConfig> = {
  [ActionType.Javascript]: {
    label: 'JavaScript',
    icon: javascriptIcon,
    mode: 'write',
  },
  [ActionType.SmartContractRead]: {
    label: 'Smart contract',
    icon: smartContractIcon,
    mode: 'read',
  },
  [ActionType.SmartContractWrite]: {
    label: 'Smart contract',
    icon: smartContractIcon,
    mode: 'write',
  },
};

type ActionMethodConfig = {
  label: string;
};

export const ACTION_METHOD_CONFIGS: Record<ActionMethod, ActionMethodConfig> = {
  [ActionMethod.Reset]: {
    label: 'Reset',
  },
  [ActionMethod.Trigger]: {
    label: 'Trigger',
  },
};
