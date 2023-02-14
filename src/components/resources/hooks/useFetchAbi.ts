import { usePrevious } from '@app/hooks/usePrevious';
import { getContractAbi } from '@app/utils/contracts';
import { prettifyJSON } from '@app/utils/string';
import { isAddress } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';

type HookArgs = {
  abi: string;
  address: string;
  chainId: number;
  onAbiChange: (newAbi: string) => void;
};

type HookReturnType = {
  error?: Error;
  isLoading: boolean;
};

export const useFetchAbi = ({
  abi,
  chainId,
  address,
  onAbiChange,
}: HookArgs): HookReturnType => {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const prevArgs = usePrevious({ address, chainId });

  useEffect(() => {
    const fetchAbi = async () => {
      setIsLoading(true);

      try {
        const fetchedAbi = await getContractAbi(address, chainId);
        onAbiChange(prettifyJSON(fetchedAbi));
        setError(undefined);
      } catch (e) {
        onAbiChange('');
        setError(e as Error);
      }

      setIsLoading(false);
    };

    if (!isAddress(address) || abi) {
      return;
    }

    if (prevArgs?.address === address && prevArgs?.chainId === chainId) {
      return;
    }

    fetchAbi();
  }, [abi, address, chainId, onAbiChange, prevArgs]);

  return { error, isLoading };
};
