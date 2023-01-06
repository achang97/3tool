import { getContractAbi } from '@app/utils/contracts';
import { isAddress } from 'ethers/lib/utils';
import { useEffect } from 'react';

type HookArgs = {
  address: string;
  chainId: number;
  onSuccess: (abi: string) => void;
  onError?: (e: Error) => void;
};

export const useFetchAbi = ({
  chainId,
  address,
  onSuccess,
  onError,
}: HookArgs) => {
  useEffect(() => {
    const fetchAbi = async () => {
      if (!address || !isAddress(address) || !chainId) {
        return;
      }

      try {
        const fetchedAbi = await getContractAbi(address, chainId);
        onSuccess(JSON.stringify(fetchedAbi, null, 2));
      } catch (e) {
        onError?.(e as Error);
      }
    };

    fetchAbi();
  }, [address, chainId, onSuccess, onError]);
};
