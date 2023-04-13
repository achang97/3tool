import { ReactNode } from 'react';
import { Box, Stack, SxProps } from '@mui/material';
import { SideNav, SideNavProps } from './SideNav';

type PageContainerProps = {
  children: ReactNode;
  sideNavConfig?: SideNavProps['config'];
  sx?: SxProps;
};

export const PageContainer = ({ children, sideNavConfig, sx }: PageContainerProps) => {
  return (
    <Box
      sx={{
        padding: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Stack spacing={4} direction="row" sx={{ height: '100%' }}>
        {sideNavConfig && <SideNav config={sideNavConfig} />}
        <Box sx={{ flex: 1 }}>{children}</Box>
      </Stack>
    </Box>
  );
};
