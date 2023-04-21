import { Stack } from '@mui/material';
import { ReactNode } from 'react';

type TeamMemberRowProps = { children: ReactNode };
export const TeamMemberRow = ({ children }: TeamMemberRowProps) => {
  return (
    <Stack
      sx={{
        border: 1,
        borderColor: 'secondary.dark',
        backgroundColor: 'background.paper',
        borderRadius: 0.5,
        paddingX: 3.5,
        paddingY: 2.25,
        alignItems: 'center',
      }}
      spacing={3.25}
      direction="row"
    >
      {children}
    </Stack>
  );
};
