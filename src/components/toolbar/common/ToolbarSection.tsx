import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type ToolbarSectionProps = {
  sx?: SxProps;
  children: ReactNode;
};

export const ToolbarSection = ({ sx, children }: ToolbarSectionProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        height: '100%',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
