import { Stack } from '@mui/material';
import { ReactNode } from 'react';

type DataGridPlaceholderProps = {
  children: ReactNode;
};

export const DataGridPlaceholder = ({ children }: DataGridPlaceholderProps) => {
  return (
    <Stack
      sx={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
      }}
    >
      {children}
    </Stack>
  );
};
