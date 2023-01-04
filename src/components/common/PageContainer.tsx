import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const PageContainer = ({ children, sx }: PageContainerProps) => {
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
      {children}
    </Box>
  );
};
