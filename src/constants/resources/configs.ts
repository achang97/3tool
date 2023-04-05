import { ResourceType } from '@app/types';

type ResourceConfig = {
  label: string;
};

export const RESOURCE_CONFIGS: Record<ResourceType, ResourceConfig> = {
  [ResourceType.SmartContract]: {
    label: 'Smart contract',
  },
  [ResourceType.Abi]: {
    label: 'ABI',
  },
};
