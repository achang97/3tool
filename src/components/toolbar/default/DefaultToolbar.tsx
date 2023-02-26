import { useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserAvatar } from '@app/components/common/UserAvatar';
import { IconButton, Menu, Tab, Tabs } from '@mui/material';
import { Tune, Logout } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMenuState } from '@app/hooks/useMenuState';
import { MenuItem } from '@app/components/common/MenuItem';
import { ToolbarTemplate } from '../common/ToolbarTemplate';

const AUTHENTICATED_LINKS = [
  { to: '/', text: 'Tools' },
  { to: '/resources', text: 'Resources' },
];

export const DefaultToolbar = () => {
  const { logout, user } = useAuth0();
  const { pathname } = useRouter();

  const { isMenuOpen, menuAnchor, onMenuOpen, onMenuClose } = useMenuState();

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
          gap: 2,
        }}
      >
        {AUTHENTICATED_LINKS.map(({ to, text }) => (
          <Tab
            component={Link}
            key={to}
            href={to}
            sx={{ height: '100%' }}
            label={text}
            value={to}
          />
        ))}
      </Tabs>
    );
  }, [pathname]);

  const right = useMemo(() => {
    return (
      <>
        <IconButton onClick={onMenuOpen} data-testid="default-toolbar-avatar">
          <UserAvatar name={user?.name} size={40} />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={onMenuClose}
          onClick={onMenuClose}
          data-testid="default-toolbar-menu"
        >
          <MenuItem
            icon={<Tune fontSize="inherit" />}
            label="Settings"
            href="/settings"
            testId="default-toolbar-settings"
          />
          <MenuItem
            icon={<Logout fontSize="inherit" />}
            label="Logout"
            color="error.main"
            onClick={handleLogout}
          />
        </Menu>
      </>
    );
  }, [onMenuOpen, user, menuAnchor, isMenuOpen, onMenuClose, handleLogout]);

  return (
    <ToolbarTemplate middle={middle} right={right} testId="default-toolbar" />
  );
};
