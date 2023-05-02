import { getNetwork, switchNetwork } from '@wagmi/core';
import { useCallback } from 'react';

export const useSwitchNetwork = () => {
  const handleSwitchNetwork = useCallback(async (chainId: number) => {
    const currentNetwork = getNetwork();
    if (currentNetwork.chain?.id !== chainId) {
      await switchNetwork({ chainId });
    }
  }, []);

  return handleSwitchNetwork;
};
