import { getContractAbi } from '@app/utils/contracts';
import { isAddress } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';

type HookArgs = {
  abi: string;
  address: string;
  chainId: number;
  onAbiChange: (newAbi: string) => void;
};

type HookReturnType = {
  error?: string;
  isLoading: boolean;
};

export const useFetchAbi = ({
  abi,
  chainId,
  address,
  onAbiChange,
}: HookArgs): HookReturnType => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAbi = async () => {
      setIsLoading(true);

      try {
        const fetchedAbi = await getContractAbi(address, chainId);
        onAbiChange(JSON.stringify(fetchedAbi, null, 2));
        setError('');
      } catch (e) {
        onAbiChange('');
        setError((e as Error).message);
      }

      setIsLoading(false);
    };

    if (!isAddress(address) || abi) {
      return;
    }

    fetchAbi();
  }, [abi, address, chainId, onAbiChange]);

  return { error, isLoading };
};
