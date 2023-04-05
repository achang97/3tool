import { Resource, ResourceType } from '@app/types';
import { mainnet } from 'wagmi';

type ResourceDataTemplates = {
  [KeyType in ResourceType]: NonNullable<Resource['data'][KeyType]>;
};

export const RESOURCE_DATA_TEMPLATES: ResourceDataTemplates = {
  [ResourceType.SmartContract]: {
    chainId: mainnet.id,
    address: '',
    abiId: '',
  },
  [ResourceType.Abi]: {
    isProxy: false,
    abi: '',
    logicAbi: '',
  },
};
