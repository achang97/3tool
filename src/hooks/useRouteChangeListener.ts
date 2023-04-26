import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useAnalytics } from './useAnalytics';

export const useRouteChangeListener = () => {
  const { pathname, query } = useRouter();
  const analytics = useAnalytics();

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
      case '/tools/[id]/[name]':
        return { name: 'App View', properties: { toolId: query.id, toolName: query.name } };
      case '/editor/[id]/[name]':
        return { name: 'App Editor', properties: { toolId: query.id, toolName: query.name } };
      default:
        return null;
    }
  }, [pathname, query]);

  useEffect(() => {
    if (!pageParams) {
      return;
    }
    analytics.page(undefined, pageParams.name, pageParams.properties);
  }, [analytics, pageParams]);
};
