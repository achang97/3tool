import { analytics } from '@app/analytics';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

export const useRouteChangeListener = () => {
  const { pathname, query } = useRouter();

  const pageParams = useMemo(() => {
    switch (pathname) {
      // Unauthenticated
      case '/login':
        return { name: 'Login' };
      case '/forgotPassword':
        return { name: 'Forgot Password' };
      case '/resetPassword':
        return { name: 'Reset Password' };
      case '/acceptInvite':
        return { name: 'Accept Invite' };
      // Authenticated
      case '/':
        return { name: 'Dashboard' };
      case '/404':
        return { name: '404' };
      case '/resources':
        return { name: 'Resources' };
      case '/settings/team':
        return { name: 'Team Settings' };
      case '/settings/account':
        return { name: 'Account Settings' };
      case '/tools/[id]':
        return { name: 'App View', properties: { toolId: query.id } };
      case '/editor/[id]':
        return { name: 'App Editor', properties: { toolId: query.id } };
      default:
        return null;
    }
  }, [pathname, query]);

  useEffect(() => {
    if (!pageParams) {
      return;
    }
    analytics.page(undefined, pageParams.name, pageParams.properties);
  }, [pageParams]);
};
