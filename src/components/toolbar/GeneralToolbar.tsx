import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserAvatar } from '@app/components/common/UserAvatar';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Tune, Logout } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ToolbarTemplate } from './ToolbarTemplate';

const AUTHENTICATED_LINKS = [
  { to: '/', text: 'Tools' },
  { to: '/resources', text: 'Resources' },
];

type MenuItemOptionProps = {
  icon: ReactNode;
  text: ReactNode;
  color?: string;
};

const MenuItemContent = ({ icon, text, color }: MenuItemOptionProps) => {
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
      <Typography sx={{ marginLeft: 2.5, fontSize: 'inherit' }}>
        {text}
      </Typography>
    </Box>
  );
};

export const GeneralToolbar = () => {
  const { logout, user } = useAuth0();
  const { pathname } = useRouter();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const menuOpen = useMemo(() => {
    return Boolean(menuAnchor);
  }, [menuAnchor]);

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setMenuAnchor(event.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleLogout = useCallback(() => {
    logout({ returnTo: window.location.origin });
  }, [logout]);

  const middle = useMemo(() => {
    return (
      <Tabs
        value={pathname}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          height: '100%',
        }}
      >
        {AUTHENTICATED_LINKS.map(({ to, text }) => (
          <Tab
            component={Link}
            key={to}
            href={to}
            sx={{ marginX: 1, height: '100%' }}
            label={text}
            value={to}
            disableRipple
          />
        ))}
      </Tabs>
    );
  }, [pathname]);

  const right = useMemo(() => {
    return (
      <>
        <IconButton
          onClick={handleMenuOpen}
          data-testid="general-toolbar-avatar"
        >
          <UserAvatar name={user?.name} size={40} />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          data-testid="general-toolbar-menu"
          sx={{ padding: 2 }}
        >
          <MenuItem component={Link} href="/settings">
            <MenuItemContent
              icon={<Tune fontSize="inherit" />}
              text="Settings"
            />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <MenuItemContent
              icon={<Logout fontSize="inherit" />}
              text="Logout"
              color="error.main"
            />
          </MenuItem>
        </Menu>
      </>
    );
  }, [
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    user,
    menuOpen,
    menuAnchor,
  ]);

  return (
    <ToolbarTemplate middle={middle} right={right} testId="general-toolbar" />
  );
};
