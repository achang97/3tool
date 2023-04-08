import { WALLETCONNECT_PROJECT_ID } from '@app/constants';
import { ethereumClient } from '@app/utils/wallet';
import { useTheme } from '@mui/material';
import { Web3Modal } from '@web3modal/react';

export const ConnectWalletModal = () => {
  const theme = useTheme();

  return (
    <Web3Modal
      projectId={WALLETCONNECT_PROJECT_ID}
      ethereumClient={ethereumClient}
      themeVariables={{
        '--w3m-font-family': 'Rubik',
        '--w3m-accent-color': theme.palette.primary.main,
        '--w3m-background-color': theme.palette.primary.main,
      }}
    />
  );
};
