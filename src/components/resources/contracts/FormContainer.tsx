import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type FormContainerProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const FormContainer = ({ children, sx }: FormContainerProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}>
      {children}
    </Box>
  );
};
