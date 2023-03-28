import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

type EditorToolbarProps = {
  children: ReactNode;
  sx?: BoxProps['sx'];
};

export const EditorToolbar = ({ children, sx }: EditorToolbarProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        paddingX: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
