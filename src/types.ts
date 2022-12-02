import { Abi } from 'abitype';

export enum ComponentType {
  Button = 'button',
  TextInput = 'text_input',
  Select = 'select',
  Table = 'table',
}

export enum SidebarViewType {
  Inspect = 'inspect',
  Create = 'create',
}

export type ContractConfig = {
  address: string;
  abi: Abi;
  chainId: number;
};
