import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type FormContainerProps = {
  children: ReactNode;
  sx?: SxProps;
  testId?: string;
};

export const FormContainer = ({ children, sx, testId }: FormContainerProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }} data-testid={testId}>
      {children}
    </Box>
  );
};
