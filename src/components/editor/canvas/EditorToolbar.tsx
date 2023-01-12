import { ConnectWalletButton } from '@app/components/common/ConnectWalletButton';
import { Box } from '@mui/material';

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
