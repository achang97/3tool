import { useRouter } from 'next/router';
import { AuthenticatedToolbar } from './AuthenticatedToolbar';

export const Toolbar = () => {
  const { pathname } = useRouter();

  if (pathname === '/apps/[id]/[name]' || pathname === '/editor/[id]/[name]') {
    return null;
  }

  return <AuthenticatedToolbar />;
};
