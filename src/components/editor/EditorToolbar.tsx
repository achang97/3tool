import { Box } from '@mui/material';
import { ConnectWalletButton } from '../common/ConnectWalletButton';

export const EditorToolbar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingX: 2,
        paddingY: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <ConnectWalletButton />
    </Box>
  );
};
