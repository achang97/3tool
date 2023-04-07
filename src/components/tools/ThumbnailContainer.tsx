import { Box, Grid } from '@mui/material';
import Link from 'next/link';
import { ReactNode, useMemo } from 'react';

type ThumbnailContainerProps = {
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  testId?: string;
};

export const ThumbnailContainer = ({
  children,
  icon,
  onClick,
  href,
  testId,
}: ThumbnailContainerProps) => {
  const linkProps = useMemo(() => {
    if (!href) {
      return {};
    }
    return {
      component: Link,
      href,
    };
  }, [href]);

  return (
    <Grid item xs={3} data-testid={testId} onClick={onClick} {...linkProps}>
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
