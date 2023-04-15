import { Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type EmptyPlaceholderProps = {
  children: ReactNode;
};

export const EmptyPlaceholder = ({ children }: EmptyPlaceholderProps) => {
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        backgroundColor: 'greyscale.offwhite.main',
        borderRadius: 1,
        height: '100%',
      }}
    >
      <Typography variant="body2">{children}</Typography>
    </Stack>
  );
};
