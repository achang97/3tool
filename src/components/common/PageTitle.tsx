import { Typography } from '@mui/material';
import { ReactNode } from 'react';

type PageTitleProps = {
  children: ReactNode;
};

export const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <Typography variant="h6" sx={{ paddingBottom: 2 }}>
      {children}
    </Typography>
  );
};
