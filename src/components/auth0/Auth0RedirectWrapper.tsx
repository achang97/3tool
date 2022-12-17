import { ReactNode, useEffect } from 'react';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import { useAuth0 } from '@auth0/auth0-react';

type Auth0RedirectWrapperProps = {
  children: ReactNode;
};

export const Auth0RedirectWrapper = ({
  children,
}: Auth0RedirectWrapperProps) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ redirectUri: window.location.origin });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) {
    return <FullscreenLoader />;
  }

  return children as JSX.Element;
};
