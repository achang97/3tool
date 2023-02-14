import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { DefaultToolbar } from './default/DefaultToolbar';

export const Toolbar = () => {
  const { isAuthenticated } = useAuth0();
  const { pathname } = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  if (pathname === '/tools/[id]' || pathname === '/editor/[id]') {
    return null;
  }

  return <DefaultToolbar />;
};
