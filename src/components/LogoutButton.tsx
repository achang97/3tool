import React, { memo, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

export const LogoutButton = memo(() => {
  const { logout } = useAuth0();

  const handleLogout = useCallback(() => {
    logout({ returnTo: window.location.origin });
  }, [logout]);

  return <Button onClick={handleLogout}>Log Out</Button>;
});
