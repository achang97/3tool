import { Box, Grid, Stack } from '@mui/material';
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
    <Grid item xs={3} data-testid={testId}>
      <Stack
        data-testid="thumbnail-container-content"
        sx={{
          alignItems: 'center',
          padding: 3,
          backgroundColor: 'greyscale.offwhite.dark',
          borderRadius: 2,
          cursor: 'pointer',
          height: '200px',
        }}
        onClick={onClick}
        {...linkProps}
      >
        <Stack
          sx={{
            flex: 3,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
          }}
        >
          {icon}
        </Stack>
        <Box sx={{ flex: 1, width: '100%' }}>{children}</Box>
      </Stack>
    </Grid>
  );
};
