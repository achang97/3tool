import { ReactNode } from 'react';
import { Stack, SxProps } from '@mui/material';
import { SideNav, SideNavProps } from './SideNav';

type PageContainerProps = {
  children: ReactNode;
  sideNavConfig?: SideNavProps['config'];
  sx?: SxProps;
};

export const PageContainer = ({ children, sideNavConfig, sx }: PageContainerProps) => {
  return (
    <Stack spacing={4} direction="row" sx={{ height: '100%', padding: 2, ...sx }}>
      {sideNavConfig && <SideNav config={sideNavConfig} />}
      <Stack sx={{ flex: 1, minHeight: 0 }}>{children}</Stack>
    </Stack>
  );
};
