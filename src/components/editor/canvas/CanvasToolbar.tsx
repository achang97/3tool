import { ConnectWalletButton } from '@app/components/common/ConnectWalletButton';
import { Stack } from '@mui/material';

export const CanvasToolbar = () => {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingX: 2,
        paddingY: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
      data-testid="canvas-toolbar"
    >
      <ConnectWalletButton />
    </Stack>
  );
};
