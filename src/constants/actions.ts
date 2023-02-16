import { ActionType } from '@app/types';
import javascriptIcon from '@app/resources/icons/actions/javascript.svg';
import smartContractIcon from '@app/resources/icons/actions/smart-contract.svg';

type ActionConfig = {
  label: string;
  icon: string;
};

export const ACTION_CONFIGS: Record<ActionType, ActionConfig> = {
  [ActionType.Javascript]: {
    label: 'JavaScript',
    icon: javascriptIcon,
  },
  [ActionType.SmartContractRead]: {
    label: 'Smart contract',
    icon: smartContractIcon,
  },
  [ActionType.SmartContractWrite]: {
    label: 'Smart contract',
    icon: smartContractIcon,
  },
};
