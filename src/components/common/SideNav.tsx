import { ReactNode, useCallback } from 'react';
import { Add } from '@mui/icons-material';
import { alpha, Box, Button, Divider, Stack, styled, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Item =
  | {
      type: 'link';
      children: ReactNode;
      href: string;
    }
  | {
      type: 'addButton';
      children: ReactNode;
      onClick: () => void;
    }
  | {
      type: 'element';
      children: ReactNode;
    };

export type SideNavProps = {
  config: {
    heading: string;
    items: Item[];
  }[];
};

const StyledButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  borderRadius: `${theme.shape.borderRadius * 0.5}px`,
  padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,

  "&[aria-current='true']": {
    backgroundColor: theme.palette.secondary.main,
  },
}));
StyledButton.defaultProps = {
  fullWidth: true,
  variant: 'text',
};

export const SideNav = ({ config }: SideNavProps) => {
  const { pathname } = useRouter();

  const renderNavItem = useCallback(
    (item: Item) => {
      switch (item.type) {
        case 'link':
          return (
            <StyledButton
              key={item.href}
              href={item.href}
              LinkComponent={Link}
              aria-current={pathname === item.href}
              sx={{ color: 'text.primary', fontWeight: 400 }}
            >
              {item.children}
            </StyledButton>
          );
        case 'addButton':
          return (
            <StyledButton
              startIcon={<Add sx={{ height: '14px', width: '14px' }} color="primary" />}
              onClick={item.onClick}
            >
              {item.children}
            </StyledButton>
          );
        case 'element':
          return item.children;

        default:
          return null;
      }
    },
    [pathname]
  );

  return (
    <Stack
      sx={{
        width: '280px',
        paddingX: 2.5,
        paddingY: 2,
        borderRadius: 1,
        backgroundColor: 'greyscale.offwhite.main',
      }}
    >
      {config.map((section) => (
        <Stack key={section.heading} component="section" sx={{ marginTop: 3.5 }} spacing={1}>
          <Typography
            variant="subtitle3"
            component="h2"
            sx={{ color: (theme) => alpha(theme.palette.text.secondary, 0.5) }}
          >
            {section.heading}
          </Typography>
          <Stack component="ul" spacing={1}>
            {section.items.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={index} component="li" sx={{ listStyle: 'none' }}>
                {renderNavItem(item)}
              </Box>
            ))}
          </Stack>
          <Divider sx={{ paddingTop: 0.5 }} />
        </Stack>
      ))}
    </Stack>
  );
};
