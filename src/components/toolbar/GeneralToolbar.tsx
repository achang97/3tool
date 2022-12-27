import { useCallback, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, IconButton, Menu, MenuItem, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ToolbarTemplate } from './ToolbarTemplate';

const AUTHENTICATED_LINKS = [
  { to: '/', text: 'Tools' },
  { to: '/resources', text: 'Resources' },
];

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
          <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.[0]}</Avatar>
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          data-testid="general-toolbar-menu"
        >
          <MenuItem component={Link} href="/settings">
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
