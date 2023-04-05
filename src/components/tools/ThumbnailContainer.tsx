import { Box, Grid } from '@mui/material';
import { ReactNode } from 'react';

type ThumbnailContainerProps = {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  testId?: string;
};

export const ThumbnailContainer = ({
  children,
  icon,
  onClick,
  testId,
}: ThumbnailContainerProps) => {
  return (
    <Grid item xs={3} data-testid={testId}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          backgroundColor: 'greyscale.offwhite.dark',
          borderRadius: 2,
          cursor: 'pointer',
          height: '200px',
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            flex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1, width: '100%' }}>{children}</Box>
      </Box>
    </Grid>
  );
};
