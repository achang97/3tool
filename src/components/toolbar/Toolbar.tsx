import { useRouter } from 'next/router';
import { useUser } from '@app/hooks/useUser';
import { AuthenticatedToolbar } from './AuthenticatedToolbar';
import { UnauthenticatedToolbar } from './UnauthenticatedToolbar';

export const Toolbar = () => {
  const user = useUser();
  const { pathname } = useRouter();

  if (!user) {
    return <UnauthenticatedToolbar />;
  }

  if (pathname === '/tools/[id]' || pathname === '/editor/[id]') {
    return null;
  }

  return <AuthenticatedToolbar />;
};
