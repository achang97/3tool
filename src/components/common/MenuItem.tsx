import { Typography, MenuItem as BaseMenuItem, BoxProps, Stack } from '@mui/material';
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
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        {icon}
        <Typography variant="body2" color="inherit">
          {label}
        </Typography>
      </Stack>
    </BaseMenuItem>
  );
};
