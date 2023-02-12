import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { GeneralToolbar } from './GeneralToolbar';

export const Toolbar = () => {
  const { isAuthenticated } = useAuth0();
  const { pathname } = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  if (pathname === '/tools/[id]' || pathname === '/editor/[id]') {
    return null;
  }

  return <GeneralToolbar />;
};
