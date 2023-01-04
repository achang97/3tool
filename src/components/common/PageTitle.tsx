import { SxProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

type PageTitleProps = {
  children: ReactNode;
  showPadding?: boolean;
  sx?: SxProps;
};

export const PageTitle = ({
  children,
  showPadding = true,
  sx,
}: PageTitleProps) => {
  return (
    <Typography variant="h6" sx={{ paddingBottom: showPadding ? 2 : 0, ...sx }}>
      {children}
    </Typography>
  );
};
