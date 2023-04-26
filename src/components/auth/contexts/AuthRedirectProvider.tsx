import { ReactNode, useEffect, useMemo } from 'react';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { useSignedInUser } from '@app/hooks/useSignedInUser';
import { useRouter } from 'next/router';
import { useGetMyUserQuery } from '@app/redux/services/users';
import { useRouteChangeListener } from '@app/hooks/useRouteChangeListener';

type AuthRedirectProviderProps = {
  children: ReactNode;
};

const UNAUTHED_ROUTES = ['/login', '/acceptInvite', '/forgotPassword', '/resetPassword'];

export const AuthRedirectProvider = ({ children }: AuthRedirectProviderProps) => {
  const user = useSignedInUser();
  const { pathname, push } = useRouter();

  // Log route changes
  useRouteChangeListener();

  // Refresh the current user if authed
  useGetMyUserQuery(undefined, { skip: !user });

  const shouldRedirectToLogin = useMemo(() => {
    return !user && !UNAUTHED_ROUTES.includes(pathname);
  }, [pathname, user]);

  const shouldRedirectToHome = useMemo(() => {
    return user && UNAUTHED_ROUTES.includes(pathname);
  }, [pathname, user]);

  useEffect(() => {
    if (shouldRedirectToLogin) {
      push('/login');
      return;
    }

    if (shouldRedirectToHome) {
      push('/');
    }
  }, [shouldRedirectToLogin, shouldRedirectToHome, push, user]);

  if (shouldRedirectToLogin || shouldRedirectToHome) {
    return <FullscreenLoader />;
  }

  return children as JSX.Element;
};
