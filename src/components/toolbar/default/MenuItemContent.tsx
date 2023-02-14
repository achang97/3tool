import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type MenuItemContentProps = {
  icon: ReactNode;
  text: ReactNode;
  color?: string;
};

export const MenuItemContent = ({
  icon,
  text,
  color,
}: MenuItemContentProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '150px',
        fontSize: '0.9rem',
        color,
      }}
    >
      {icon}
      <Typography
        sx={{ marginLeft: 2.5, fontSize: 'inherit', color: 'inherit' }}
      >
        {text}
      </Typography>
    </Box>
  );
};
