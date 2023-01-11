import { Wallet } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useWeb3Modal } from '@web3modal/react';
import { useCallback } from 'react';

export const ConnectWalletButton = () => {
  const { open } = useWeb3Modal();

  const handleConnectWallet = useCallback(() => {
    open();
  }, [open]);

  return (
    <Button
      startIcon={<Wallet />}
      onClick={handleConnectWallet}
      data-testid="connect-wallet-button"
    >
      Connect Wallet
    </Button>
  );
};
