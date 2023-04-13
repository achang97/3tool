import { useCallback, useMemo } from 'react';
import { UserAvatar } from '@app/components/common/UserAvatar';
import { IconButton, Menu, Tab, Tabs } from '@mui/material';
import { Tune, Logout } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMenuState } from '@app/hooks/useMenuState';
import { MenuItem } from '@app/components/common/MenuItem';
import { useUser } from '@app/hooks/useUser';
import { useLogout } from '@app/hooks/useLogout';
import { ToolbarTemplate } from './common/ToolbarTemplate';

const AUTHENTICATED_LINKS = [
  { to: '/', text: 'Tools' },
  { to: '/resources', text: 'Resources' },
];

export const AuthenticatedToolbar = () => {
  const user = useUser();
  const logout = useLogout();
  const { pathname } = useRouter();

  const { isMenuOpen, menuAnchor, onMenuOpen, onMenuClose } = useMenuState();

  const handleLogout = useCallback(() => {
    logout();
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
        {user && (
          <IconButton onClick={onMenuOpen} data-testid="authenticated-toolbar-avatar">
            <UserAvatar user={user} size={40} />
          </IconButton>
        )}
        <Menu
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={onMenuClose}
          onClick={onMenuClose}
          data-testid="authenticated-toolbar-menu"
        >
          <MenuItem
            icon={<Tune fontSize="inherit" />}
            label="Settings"
            href="/settings/team"
            testId="authenticated-toolbar-settings"
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

  return <ToolbarTemplate middle={middle} right={right} testId="authenticated-toolbar" />;
};
