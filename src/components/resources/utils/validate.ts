import { Resource, ResourceType } from '@app/types';
import { isJSON } from '@app/utils/string';
import { isAddress } from 'ethers/lib/utils';

export const validateResource = (resource: Resource): boolean => {
  switch (resource.type) {
    case ResourceType.SmartContract: {
      const data = resource.data.smartContract;
      return !!data && isAddress(data.address);
    }
    case ResourceType.Abi: {
      const data = resource.data.abi;
      if (!data) {
        return false;
      }
      if (data.isProxy && (!data.logicAbi || !isJSON(data.logicAbi))) {
        return false;
      }
      return isJSON(data.abi);
    }
    default:
      return true;
  }
};
