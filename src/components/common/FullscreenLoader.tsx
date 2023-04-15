import { CircularProgress, Stack } from '@mui/material';

export const FullscreenLoader = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress data-testid="fullscreen-loader" />
    </Stack>
  );
};
