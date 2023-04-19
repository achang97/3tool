import { useRouter } from 'next/router';
import { useUser } from '@app/hooks/useUser';
import { AuthenticatedToolbar } from './AuthenticatedToolbar';

export const Toolbar = () => {
  const user = useUser();
  const { pathname } = useRouter();

  if (!user || pathname === '/tools/[id]' || pathname === '/editor/[id]') {
    return null;
  }

  return <AuthenticatedToolbar />;
};
