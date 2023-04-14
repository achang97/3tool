import { useGetResourcesQuery } from '@app/redux/services/resources';
import { ResourceType } from '@app/types';
import { useMemo } from 'react';

export const useSmartContractResources = () => {
  const { data: resources } = useGetResourcesQuery('');

  const smartContracts = useMemo(() => {
    if (!resources) {
      return [];
    }

    return resources.filter((resource) => resource.type === ResourceType.SmartContract);
  }, [resources]);

  return smartContracts;
};
