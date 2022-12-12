import React, { memo, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes } from 'routing/routes';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ToolbarLogo } from './ToolbarLogo';

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

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <ToolbarLogo />
        {AUTHENTICATED_LINKS.map(({ to, text }) => (
          <Link key={to} to={to}>
            <Typography sx={{ mx: 1 }}>{text}</Typography>
          </Link>
        ))}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <IconButton onClick={handleMenuOpen}>
          <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.[0]}</Avatar>
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <MenuItem>
            <Link to={Routes.Settings}>Settings</Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
});
