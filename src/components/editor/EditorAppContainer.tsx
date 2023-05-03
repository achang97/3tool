import { Stack } from '@mui/material';
import { ReactNode } from 'react';

type EditorAppContainerProps = {
  children: ReactNode;
};

export const EditorAppContainer = ({ children }: EditorAppContainerProps) => {
  return (
    <Stack sx={{ alignItems: 'center', flex: 1 }}>
      <Stack sx={{ minWidth: 500, maxWidth: 1500, height: '100%', width: '100%' }}>
        {children}
      </Stack>
    </Stack>
  );
};
