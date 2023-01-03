import { Box } from '@mui/material';
import { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => {
  return <Box sx={{ padding: 2 }}>{children}</Box>;
};
