import { getContractAbi } from '@app/utils/contracts';
import { prettifyJSON } from '@app/utils/string';
import { isAddress } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';

type HookArgs = {
  address?: string;
  chainId?: number;
};

type HookReturnType = {
  abi: string;
  error?: Error;
  isLoading: boolean;
};

export const useFetchAbi = ({ chainId, address }: HookArgs): HookReturnType => {
  const [abi, setAbi] = useState('');
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAbi = async () => {
      if (!address || !chainId || !isAddress(address)) {
        return;
      }

      setIsLoading(true);

      try {
        const fetchedAbi = await getContractAbi(address, chainId);
        setAbi(prettifyJSON(fetchedAbi));
        setError(undefined);
      } catch (e) {
        setAbi('');
        setError(e as Error);
      }

      setIsLoading(false);
    };

    fetchAbi();
  }, [address, chainId]);

  return { abi, error, isLoading };
};
