import { Resource, SmartContractBaseData } from '@app/types';
import { useCallback } from 'react';
import { useAbiResources } from '@app/components/resources/hooks/useAbiResources';
import { useSmartContractResources } from '@app/components/resources/hooks/useSmartContractResources';
import { ACTION_DATA_TYPES } from '@app/constants';
import { parseResourceAbi } from '@app/utils/abi';
import { useEvalDynamicValue } from './useEvalDynamicValue';

export const useActionSmartContract = () => {
  const abiResources = useAbiResources();
  const smartContractResources = useSmartContractResources();
  const evalDynamicValue = useEvalDynamicValue();

  const getSmartContract = useCallback(
    (data: SmartContractBaseData, args?: Record<string, unknown>) => {
      let smartContractData: Resource['data']['smartContract'];
      if (data.freeform) {
        smartContractData = {
          chainId: evalDynamicValue<number>(
            data.freeformChainId,
            ACTION_DATA_TYPES.smartContractRead.freeformChainId,
            args
          ),
          address: evalDynamicValue<string>(
            data.freeformAddress,
            ACTION_DATA_TYPES.smartContractRead.freeformAddress,
            args
          ),
          abiId: data.freeformAbiId,
        };
      } else {
        const smartContract = smartContractResources?.find(
          (currContract) => currContract._id === data.smartContractId
        );
        smartContractData = smartContract?.data?.smartContract;
      }

      const abiResource = abiResources.find((currAbi) => currAbi._id === smartContractData?.abiId);
      const abi = parseResourceAbi(abiResource?.data?.abi);

      return {
        address: smartContractData?.address,
        chainId: smartContractData?.chainId,
        abi,
      };
    },
    [abiResources, evalDynamicValue, smartContractResources]
  );

  return getSmartContract;
};
