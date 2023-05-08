import {
  Typography,
  MenuItem as BaseMenuItem,
  MenuItemProps as BaseMenuItemProps,
  BoxProps,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import { ComponentRef, forwardRef, HTMLAttributeAnchorTarget, ReactNode, useMemo } from 'react';

type MenuItemProps = BaseMenuItemProps & {
  icon?: ReactNode;
  label: ReactNode;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  color?: BoxProps['color'];
  testId?: string;
};

export const MenuItem = forwardRef<ComponentRef<typeof BaseMenuItem>, MenuItemProps>(
  ({ icon, label, color, href, target, testId, sx, ...rest }, ref) => {
    const linkProps = useMemo(() => {
      if (!href) {
        return {};
      }
      return {
        component: Link,
        href,
        target,
      };
    }, [href, target]);

    const sxWithColor = useMemo(() => ({ color, ...sx }), [sx, color]);

    return (
      <BaseMenuItem {...linkProps} sx={sxWithColor} data-testid={testId} {...rest} ref={ref}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {icon}
          <Typography variant="body2" color="inherit">
            {label}
          </Typography>
        </Stack>
      </BaseMenuItem>
    );
  }
);
