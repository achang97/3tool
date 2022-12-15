import React, { memo, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes } from 'routing/routes';
import { Avatar, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { ToolbarTemplate } from './ToolbarTemplate';

const AUTHENTICATED_LINKS = [
  { to: Routes.Tools, text: 'Tools' },
  { to: Routes.Resources, text: 'Resources' },
];

export const GeneralToolbar = memo(() => {
  const { logout, user } = useAuth0();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

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

  const left = useMemo(() => {
    return (
      <>
        {AUTHENTICATED_LINKS.map(({ to, text }) => (
          <Button component={Link} key={to} to={to} sx={{ mx: 1 }}>
            {text}
          </Button>
        ))}
      </>
    );
  }, []);

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
          <MenuItem component={Link} to={Routes.Settings}>
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

  return <ToolbarTemplate left={left} right={right} testId="general-toolbar" />;
});
