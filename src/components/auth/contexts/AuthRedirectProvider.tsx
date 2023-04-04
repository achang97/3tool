import { ReactNode, useEffect, useMemo } from 'react';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { useUser } from '@app/hooks/useUser';
import { useRouter } from 'next/router';

type AuthRedirectProviderProps = {
  children: ReactNode;
};

const UNAUTHED_ROUTES = ['/login'];

export const AuthRedirectProvider = ({
  children,
}: AuthRedirectProviderProps) => {
  const user = useUser();
  const { pathname, push } = useRouter();

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
