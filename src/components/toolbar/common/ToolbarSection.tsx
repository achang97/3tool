import { Stack, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type ToolbarSectionProps = {
  sx?: SxProps;
  children: ReactNode;
};

export const ToolbarSection = ({ sx, children }: ToolbarSectionProps) => {
  return (
    <Stack direction="row" sx={{ flex: 1, alignItems: 'center', height: '100%', ...sx }}>
      {children}
    </Stack>
  );
};
