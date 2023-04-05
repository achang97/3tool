import { useGetResourcesQuery } from '@app/redux/services/resources';
import { ResourceType } from '@app/types';
import { useMemo } from 'react';

export const useAbiResources = () => {
  const { data: resources } = useGetResourcesQuery('');

  const abis = useMemo(() => {
    if (!resources) {
      return [];
    }

    return resources?.filter((resource) => resource.type === ResourceType.Abi);
  }, [resources]);

  return abis;
};
