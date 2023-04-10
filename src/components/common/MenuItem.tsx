import { Box, Typography, MenuItem as BaseMenuItem, BoxProps } from '@mui/material';
import Link from 'next/link';
import { ReactNode, useMemo } from 'react';

type MenuItemProps = {
  icon?: ReactNode;
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  color?: BoxProps['color'];
  testId?: string;
};

export const MenuItem = ({ icon, label, color, onClick, href, testId }: MenuItemProps) => {
  const linkProps = useMemo(() => {
    if (!href) {
      return {};
    }
    return {
      component: Link,
      href,
    };
  }, [href]);

  return (
    <BaseMenuItem {...linkProps} onClick={onClick} sx={{ color }} data-testid={testId}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {icon}
        <Typography variant="body2" color="inherit">
          {label}
        </Typography>
      </Box>
    </BaseMenuItem>
  );
};
