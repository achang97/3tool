import { Role } from '@app/types';
import { useMemo } from 'react';
import { useSignedInUser } from './useSignedInUser';

export const useSignedInUserHasRole = (role: Role): boolean => {
  const signedInUser = useSignedInUser();

  const signedInUserHasRole = useMemo(() => {
    if (!signedInUser) return false;

    switch (role) {
      case Role.Admin:
        return signedInUser.roles.isAdmin;
      case Role.Editor:
        return signedInUser.roles.isEditor;
      case Role.Viewer:
        return signedInUser.roles.isViewer;
      default:
        return false;
    }
  }, [signedInUser, role]);

  return signedInUserHasRole;
};
