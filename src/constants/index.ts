import { Chain, mainnet, goerli } from 'wagmi';
import { ComponentType } from '@app/types';
import buttonIcon from '@app/resources/icons/button.svg';
import textInputIcon from '@app/resources/icons/text-input.svg';
import numberInputIcon from '@app/resources/icons/number-input.svg';
import containerIcon from '@app/resources/icons/container.svg';
import textIcon from '@app/resources/icons/text.svg';
import tableIcon from '@app/resources/icons/table.svg';
import selectIcon from '@app/resources/icons/select.svg';

export const ETHERSCAN_API_KEY =
  process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '';
export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const MSW_API =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_MSW_API === 'true';

export const CHAINS = [mainnet, goerli];

export const CHAINS_BY_ID = CHAINS.reduce(
  (accumulator: Record<string, Chain>, currChain: Chain) => {
    accumulator[currChain.id] = currChain;
    return accumulator;
  },
  {}
);

export const COMPONENTS_BY_TYPE: Record<
  ComponentType,
  { label: string; icon: string }
> = {
  [ComponentType.Button]: {
    label: 'Button',
    icon: buttonIcon,
  },
  [ComponentType.TextInput]: {
    label: 'Text Input',
    icon: textInputIcon,
  },
  [ComponentType.NumberInput]: {
    label: 'Number Input',
    icon: numberInputIcon,
  },
  [ComponentType.Select]: {
    label: 'Select',
    icon: selectIcon,
  },
  [ComponentType.Container]: {
    label: 'Container',
    icon: containerIcon,
  },
  [ComponentType.Text]: {
    label: 'Text',
    icon: textIcon,
  },
  [ComponentType.Table]: {
    label: 'Table',
    icon: tableIcon,
  },
};
