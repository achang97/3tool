import { Box } from '@mui/material';
import { Web3Button } from '@web3modal/react';

export const ConnectWalletButton = () => {
  return (
    <Box data-testid="connect-wallet-button">
      <Web3Button />
    </Box>
  );
};
