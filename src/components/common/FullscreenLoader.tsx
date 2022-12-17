import { Box, CircularProgress } from '@mui/material';

export const FullscreenLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress data-testid="fullscreen-loader" />
    </Box>
  );
};
