import { Resource, ResourceType, SmartContractData } from '@app/types';
import { isJSON } from '@app/utils/string';
import { isAddress } from 'ethers/lib/utils';
import { useCallback } from 'react';

type HookArgs = {
  name: string;
  smartContract: Required<SmartContractData>;
  onSubmit: (resource: Pick<Resource, 'type' | 'name' | 'data'>) => void;
};
export const useSubmitSmartContract = ({
  name,
  smartContract,
  onSubmit,
}: HookArgs) => {
  const handleSubmit = useCallback(() => {
    const { chainId, address, abi, logicAbi, logicAddress, isProxy } =
      smartContract;

    if (!isAddress(address) || !isJSON(abi)) {
      return;
    }

    if (isProxy && (!isAddress(logicAddress) || !isJSON(logicAbi))) {
      return;
    }

    onSubmit({
      type: ResourceType.SmartContract,
      name,
      data: {
        smartContract: {
          chainId,
          address,
          abi,
          isProxy,
          logicAddress: isProxy ? logicAddress : undefined,
          logicAbi: isProxy ? logicAbi : undefined,
        },
      },
    });
  }, [name, onSubmit, smartContract]);

  return handleSubmit;
};
