import { useRouter } from 'next/router';
import { useSignedInUser } from '@app/hooks/useSignedInUser';
import { AuthenticatedToolbar } from './AuthenticatedToolbar';

export const Toolbar = () => {
  const user = useSignedInUser();
  const { pathname } = useRouter();

  if (!user || pathname === '/tools/[id]' || pathname === '/editor/[id]') {
    return null;
  }

  return <AuthenticatedToolbar />;
};
