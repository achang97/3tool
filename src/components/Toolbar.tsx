import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { Routes } from 'routing/routes';
import logo from 'resources/images/logo.png';
import { LogoutButton } from './LogoutButton';

const AUTHENTICATED_LINKS = [
  { to: Routes.Root, text: 'Tools' },
  { to: Routes.Resources, text: 'Resources' },
];

export const Toolbar = memo(() => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <img src={logo} alt="ACA Labs logo" />
        {AUTHENTICATED_LINKS.map(({ to, text }) => (
          <Link key={to} to={to}>
            <Typography sx={{ mx: 1 }}>{text}</Typography>
          </Link>
        ))}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <LogoutButton />
      </Box>
    </Box>
  );
});
